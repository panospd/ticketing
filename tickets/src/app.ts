import "express-async-errors"
import exprress from "express"
import "express-async-errors"
import { json } from "body-parser"

import cookieSession from "cookie-session";
import { NotFoundError, currentUser, errorHandler } from "@ticketingpd/common";
import { createTicketRouter } from "./routes/new";
import { showTicketRouter } from "./routes/show";
import { indexTicketRouter } from "./routes";
import { updateTicketRouter } from "./routes/update";

const app = exprress();
app.set("trust proxy", true)

app.use(json())

app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test"
}))

app.use(currentUser)

app.use(createTicketRouter)
app.use(showTicketRouter)
app.use(indexTicketRouter)
app.use(updateTicketRouter)

app.all("*", async () => {
    throw new NotFoundError()
})

app.use(errorHandler)

export { app }