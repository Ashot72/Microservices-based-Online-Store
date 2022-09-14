import express from "express"
import "express-async-errors";
import { json } from "body-parser"
const cors = require("cors")
import cookieSession from "cookie-session"

import { currentUser, errorHandler, NotFoundError } from "@lightningtools/common"

import { indexCategoriesRouter } from "./routes/categories/index"
import { createCategoryRouter } from "./routes/categories/new"
import { updateCategoryRouter } from "./routes/categories/update"
import { deleteCategoryRouter } from "./routes/categories/delete"

import { indexProductsRouter } from "./routes/products/index"
import { userProductsRouter } from "./routes/products/userProducts"
import { createProductRouter } from "./routes/products/new"
import { updateProductRouter } from "./routes/products/update"
import { deleteProductRouter } from "./routes/products/delete"
import { addProductToCartRouter } from "./routes/products/addProductToCart"

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

app.use(indexCategoriesRouter)
app.use(createCategoryRouter)
app.use(updateCategoryRouter)
app.use(deleteCategoryRouter)

app.use(indexProductsRouter)
app.use(createProductRouter)
app.use(updateProductRouter)
app.use(deleteProductRouter)
app.use(userProductsRouter)
app.use(addProductToCartRouter)

app.all("*", async () => {
    throw new NotFoundError()
})

app.use(errorHandler)

export { app }
