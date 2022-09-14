import express from "express"
import "express-async-errors";
import { json } from "body-parser"
const cors = require("cors")
import cookieSession from "cookie-session"
import { currentUserRouter } from "./routes/current-user"
import { signinRouter } from "./routes/signin"
import { signupRouter } from "./routes/signup"
import { signoutRouter } from "./routes/signout"

import { errorHandler, NotFoundError } from "@lightningtools/common"

const app = express()
app.set("trust proxy", true)
app.use(json())
app.use(
    cookieSession({
        signed: false
        // secure: true
    })
)

app.use(cors())

app.use(currentUserRouter)
app.use(signinRouter)
app.use(signupRouter)
app.use(signoutRouter)

app.all("*", async () => {
    throw new NotFoundError()
})

app.use(errorHandler)

export { app }

