import express, { Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
import { RequestValidationError } from "../errors/request-validation-error"
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
    async (req: Request, res: Response) => {
        var errors = validationResult(req);
        
        if (!errors.isEmpty()) {
            throw new RequestValidationError(errors.array())
        }

        var user = await User.findOne({ email: req.body.email })

        res.send("This is signin!")
    }
)

export { router as signinRouter }