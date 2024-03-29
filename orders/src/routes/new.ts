import { BadRequestError, NotFoundError, OrderStatus, requireAuth, validateRequest } from "@ticketingpd/common";
import express, { Request, Response } from "express"
import { body } from "express-validator";
import mongoose from "mongoose";
import { Ticket } from "../models/ticket";
import { Order } from "../models/order";
import { OrderCreatedPublisher } from "../events/publishers/order-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 1 * 60;

router.post("/api/orders", requireAuth, [
    body("ticketId")
        .not()
        .isEmpty()
        .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
        .withMessage("TicketId must be provided")
], validateRequest, async (req: Request, res: Response) => {
    const { ticketId } = req.body;

    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
        throw new NotFoundError()
    }

    if (await ticket.isReserved()) {
        throw new BadRequestError("Ticket is already reserved.")
    }

    const expiration = new Date()
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS)

    const order = Order.build({
        userId: req.currentUser!.id,
        expiresAt: expiration,
        status: OrderStatus.Created,
        ticket
    })

    await order.save();

    new OrderCreatedPublisher(natsWrapper.client).publish({
        id: order.id,
        version: order.version,
        status: order.status,
        expiresAt: order.expiresAt.toISOString(),
        userId: order.userId,
        ticket: {
            id: ticket.id,
            price: ticket.price
        }
    });

    res.status(201).send(order)
})

export { router as newOrderRouter }