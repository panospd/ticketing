import "express-async-errors"
import exprress from "express"
import "express-async-errors"
import { json } from "body-parser"

import cookieSession from "cookie-session";
import { NotFoundError, currentUser, errorHandler } from "@ticketingpd/common";
import { createChargeRouter } from "./routes/new";

const app = exprress();
app.set("trust proxy", true)

app.use(json())

app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test"
}))

app.use(currentUser)

app.use(createChargeRouter)

app.all("*", async () => {
    throw new NotFoundError()
})

app.use(errorHandler)

export { app }