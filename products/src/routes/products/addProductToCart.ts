import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import mongoose from 'mongoose'

import { natsWrapper } from '../../nats-wrapper'
import { AddToCartPublisher } from '../../events/publishers/add-to-cart-publisher'
import { ProductSelectedPublisher } from '../../events/publishers/product-selected-publisher'
import { validateRequest, requireAuth, NotFoundError } from "@lightningtools/common"
import { Category } from '../../models/category'
import { Product } from '../../models/product'
import { ProductUpdatedPublisher } from '../../events/publishers/product-updated-publisher'

const EXPIRATION_SECONDS = 1 * 15 //1 * 60

const router = express.Router()

router.post("/api/products/addToCart", requireAuth, [
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
    body("picture")
        .not()
        .isEmpty()
        .withMessage("Picture is required"),
    body("version")
        .not()
        .isEmpty()
        .withMessage("Version is required"),
],
    validateRequest,
    async (req: Request, res: Response) => {
        const { id, categoryId } = req.body

        const category = await Category.findById(categoryId)
        if (!category) throw new NotFoundError()

        const product = await Product.findById(id)
        if (!product) throw new NotFoundError()

        product.set({ views: product.views + 1 })

        await product.save()

        new ProductUpdatedPublisher(natsWrapper.client).publish({
            id: product.id,
            name: product.name,
            description: product.description,
            categoryId,
            picture: product.picture,
            price: product.price,
            userId: req.currentUser!.id,
            count: product.count,
            version: product.version!
        })

        const addToCart = {
            productId: id,
            name: product.name,
            description: product.description,
            picture: product.picture,
            price: product.price,
            categoryId,
            version: product.version!,
            count: 1,
            userId: req.currentUser!.id
        }

        await new AddToCartPublisher(natsWrapper.client).publish(addToCart)

        const expiration = new Date()
        expiration.setSeconds(expiration.getSeconds() + EXPIRATION_SECONDS)

        new ProductSelectedPublisher(natsWrapper.client).publish({
            productId: id,
            views: product.views,
            userId: product.userId,
            categoryId,
            expiresAt: expiration.toISOString()
        })

        res.send(addToCart)
    }
)

export { router as addProductToCartRouter }