import express, { Request, Response } from 'express'

import {
  requireAuth,
  NotFoundError,
  NotAuthorizedError
} from "@lightningtools/common"
import { ProductDeletedPublisher } from '../../events/publishers/product-deleted-publisher'
import { Product } from '../../models/product'
import { natsWrapper } from '../../nats-wrapper'

const router = express.Router()

router.delete("/api/products/:id",
  requireAuth,
  async (req: Request, res: Response) => {
    const productId = req.params.id
    const product = await Product.findById(productId)

    if (!product) {
      throw new NotFoundError()
    }

    if (product.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError()
    }

    await Product.deleteById(productId)

    // new ProductDeletedPublisher(natsWrapper.client).publish({
    //   id: productId
    // })

    return res.status(204).send({ productId })
  }
)

export { router as deleteProductRouter }