import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { validateRequest } from '../middlewares/validate-request'
import { User } from '../models/user'

const router = express.Router()

router.post(
    "/api/users/signin", 
    [
        body("email")
            .isEmail()
            .withMessage("Email must be valid"),
        body("password")
            .trim()
            .notEmpty()
            .withMessage("You must supply a password")
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        var user = await User.findOne({ email: req.body.email })

        res.send("This is signin!")
    }
)

export { router as signinRouter }