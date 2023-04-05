import { requireAuth, validateRequest } from "@ticketingpd/common"
import express, { Request, Response } from "express"
import { body } from "express-validator"
import { Ticket } from "../models/ticket"

const router = express.Router()

router.post(
    "/api/tickets",
    requireAuth, [
    body("title")
        .notEmpty()
        .withMessage("Title must be provided"),
    body("price")
        .isFloat({
            gt: 0
        })
        .withMessage("Price must be greater than 0")
],
    validateRequest,
    async (req: Request, res: Response) => {
        const { title, price } = req.body;
        const userId = req.currentUser!.id;

        const ticket = Ticket.build({
            title: title,
            price: price,
            userId
        })

        await ticket.save()

        return res.status(201).send(ticket)
    }
)

export { router as createTicketRouter }
