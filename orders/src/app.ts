import "express-async-errors"
import exprress from "express"
import "express-async-errors"
import { json } from "body-parser"

import cookieSession from "cookie-session";
import { NotFoundError, currentUser, errorHandler } from "@ticketingpd/common";
import { deleteOrderRouter } from "./routes/delete";
import { newOrderRouter } from "./routes/new";
import { showOrderRouter } from "./routes/show";
import { indexOrderRouter } from "./routes";

const app = exprress();
app.set("trust proxy", true)

app.use(json())

app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test"
}))

app.use(currentUser)

app.use(deleteOrderRouter)
app.use(indexOrderRouter)
app.use(newOrderRouter)
app.use(showOrderRouter)

app.all("*", async () => {
    throw new NotFoundError()
})

app.use(errorHandler)

export { app }