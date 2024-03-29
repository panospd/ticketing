import "express-async-errors"
import exprress from "express"
import "express-async-errors"
import { json } from "body-parser"
import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signupRouter } from "./routes/signup";
import { signoutRouter } from "./routes/signout";

import cookieSession from "cookie-session";
import { NotFoundError, errorHandler } from "@ticketingpd/common";

const app = exprress();
app.set("trust proxy", true)

app.use(json())

app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test"
}))

app.use(currentUserRouter)
app.use(signinRouter)
app.use(signoutRouter)
app.use(signupRouter)

app.all("*", async () => {
    throw new NotFoundError()
})

app.use(errorHandler)

export { app }