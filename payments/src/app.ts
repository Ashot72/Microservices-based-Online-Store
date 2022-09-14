import express from "express"
import "express-async-errors";
import { json } from "body-parser"
import { currentUser, errorHandler, NotFoundError } from "@lightningtools/common"
const cors = require("cors")
import cookieSession from "cookie-session"
import { createPaymentRouter } from "./routes/new"
import { indexPaymentsRouter } from "./routes"

const app = express()
app.set("trust proxy", true)
app.use(json({ limit: '50mb' }))
app.use(
    cookieSession({
        signed: false
        // secure: true
    })
)

app.use(cors());

app.use(currentUser)

app.use(createPaymentRouter)
app.use(indexPaymentsRouter)

app.all("*", async () => {
    throw new NotFoundError()
})

app.use(errorHandler)

export { app }