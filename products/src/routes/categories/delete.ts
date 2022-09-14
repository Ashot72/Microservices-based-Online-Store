import express, { Request, Response } from 'express'
import mongoose from "mongoose"

import {
    requireAuth,
    NotFoundError,
    NotAuthorizedError,
    BadRequestError
} from "@lightningtools/common"
import { Category } from '../../models/category'
import { Product } from '../../models/product'

const router = express.Router()

router.delete("/api/categories/:id",
    requireAuth,
    async (req: Request, res: Response) => {
        const categoryId = req.params.id
        const category = await Category.findById(categoryId)

        if (!category) {
            throw new NotFoundError()
        }

        if (category.userId !== req.currentUser!.id) {
            throw new NotAuthorizedError()
        }

        const products = await Product.find({ category: new mongoose.Types.ObjectId(categoryId) })

        if (products.length > 0) {
            throw new BadRequestError(`You cannot delete category '${category.name}'. There is a product attached to this category.`)
        }

        await Category.deleteById(categoryId)
        return res.status(204).send({ categoryId })
    }
)

export { router as deleteCategoryRouter }
