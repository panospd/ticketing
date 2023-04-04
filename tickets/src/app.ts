import "express-async-errors"
import exprress from "express"
import "express-async-errors"
import { json } from "body-parser"

import cookieSession from "cookie-session";
import { NotFoundError, errorHandler } from "@ticketingpd/common";

const app = exprress();
app.set("trust proxy", true)

app.use(json())

app.get("/api/tickets", (req, res) => {
    return res.send("hello tickets")
})

app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test"
}))

app.all("*", async () => {
    throw new NotFoundError()
})

app.use(errorHandler)

export { app }