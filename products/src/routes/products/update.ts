import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import mongoose from 'mongoose'
import { natsWrapper } from '../../nats-wrapper'

import {
  validateRequest,
  requireAuth,
  NotFoundError,
  NotAuthorizedError
} from "@lightningtools/common"
import { ProductUpdatedPublisher } from '../../events/publishers/product-updated-publisher'
import { Category } from '../../models/category'
import { Product } from '../../models/product'

const router = express.Router()

router.put("/api/products/:id",
  requireAuth,
  [
    body('categoryId')
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input)),
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
      .withMessage("Price must be greater than 0")
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    let product = await Product.findById(req.params.id)

    if (!product) {
      throw new NotFoundError()
    }

    const { categoryId, name, description, picture, count, price } = req.body
    const category = await Category.findById(categoryId)

    if (!category) {
      throw new NotFoundError()
    }

    if (product.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError()
    }


    let updatedProduct = {
      name,
      description,
      category,
      price,
      count,
      userId: req.currentUser!.id,
      picture: picture || product.picture
    }

    product.set(updatedProduct)
    await product.save()

    new ProductUpdatedPublisher(natsWrapper.client).publish({
      id: product.id,
      name: product.name,
      description: product.description,
      categoryId: category.id,
      picture: product.picture,
      price: product.price,
      userId: product.userId,
      count: product.count,
      version: product.version
    })

    res.send(product)
  })

export { router as updateProductRouter }

