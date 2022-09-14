import express, { Request, Response } from 'express'
import mongoose from "mongoose"
import { Product } from '../../models/product'

const router = express.Router()

router.get("/api/products/:catId", async (req: Request, res: Response) => {
    const products = await Product.find({ category: new mongoose.Types.ObjectId(req.params.catId) }).populate("category")

    res.send(products)
})

export { router as indexProductsRouter }