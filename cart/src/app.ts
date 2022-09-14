import express from "express"
import "express-async-errors";
import { json } from "body-parser"
const cors = require("cors")
import cookieSession from "cookie-session"
import { currentUser, errorHandler, NotFoundError } from "@lightningtools/common"
import { indexCartRouter } from "./routes/index"
import { addRemoveRouter } from "./routes/addRemove"
import { removeRouter } from "./routes/remove"

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

app.use(indexCartRouter)
app.use(addRemoveRouter)
app.use(removeRouter)

app.all("*", async () => {
    throw new NotFoundError()
})

app.use(errorHandler)

export { app }