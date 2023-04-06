import { NotAuthorizedError, NotFoundError, requireAuth, validateRequest } from "@ticketingpd/common"
import express, { Request, Response } from "express"
import { body } from "express-validator"
import { Ticket } from "../models/ticket"

const router = express.Router()

router.put("/api/tickets/:id", requireAuth, [
    body("title")
        .notEmpty()
        .withMessage("title is required"),
    body("price")
        .isFloat({ gt: 0 })
        .withMessage("Price must be provided and must be greater than 0")
], validateRequest, async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id)

    if (!ticket) {
        throw new NotFoundError()
    }

    if (ticket.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError()
    }

    return res.send(ticket)
})

export { router as updateTicketRouter }