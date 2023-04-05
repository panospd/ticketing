import { requireAuth, validateRequest } from "@ticketingpd/common"
import express, { Request, Response } from "express"
import { body } from "express-validator"

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
    (req: Request, res: Response) => {
        return res.send({})
    }
)

export { router as createTicketRouter }
