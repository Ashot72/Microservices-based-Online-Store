import express, { Request, Response } from 'express'
import { natsWrapper } from '../../nats-wrapper'
import { body } from 'express-validator'
import mongoose from 'mongoose'
import { validateRequest, requireAuth, NotFoundError } from "@lightningtools/common"
import { ProductCreatedPublisher } from '../../events/publishers/product-created-publisher'
import { Category } from '../../models/category'
import { Product } from '../../models/product'

const router = express.Router()

router.post("/api/products", requireAuth, [
    body('categoryId')
        .not()
        .isEmpty()
        .withMessage("Category is required"),
    body('categoryId')
        .custom((input: string) => input ? mongoose.Types.ObjectId.isValid(input) : true)
        .withMessage("Invalid Category Id"),
    body("name")
        .not()
        .isEmpty()
        .withMessage("Name is required"),
    body("description")
        .not()
        .isEmpty()
        .withMessage("Description is required"),
    body("price")
        .isFloat({ gt: 0 })
        .withMessage("Price must be greater than 0"),
    body("count")
        .isInt({ gt: 0 })
        .withMessage("Count must be greater than 0"),
    body("picture")
        .not()
        .isEmpty()
        .withMessage("Picture is required")
],
    validateRequest,
    async (req: Request, res: Response) => {
        const { name, description, picture, price, count, categoryId } = req.body
        const category = await Category.findById(categoryId)

        if (!category) {
            throw new NotFoundError()
        }

        const product = Product.build({
            name,
            description,
            price,
            picture,
            category,
            count,
            userId: req.currentUser!.id,
            views: 0
        })

        await product.save()

        await new ProductCreatedPublisher(natsWrapper.client).publish({
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            picture: product.picture,
            userId: product.userId,
            categoryId: product.category.userId,
            count: product.count,
            version: product.version,
        })

        res.status(201).send(product)
    }
)

export { router as createProductRouter }