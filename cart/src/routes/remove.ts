import express, { Request, Response } from 'express'
import {
    requireAuth,
    NotFoundError
} from "@lightningtools/common"
import { Cart } from '../models/cart'
import { natsWrapper } from '../nats-wrapper'
import { Product } from '../models/product'
import { CartItemReceivedPublisher } from '../events/publishers/cart-item-received-publisher'

const router = express.Router()

router.post("/api/cart/itemRemove",
    requireAuth,
    async (req: Request, res: Response) => {
        const { id: productId } = req.body

        let cart = await Cart.findOne({ _id: req.currentUser!.id, "info.product": productId })
        if (!cart) {
            throw new NotFoundError()
        }

        let product = await Product.findById(productId)
        if (!product) {
            throw new NotFoundError()
        }

        const publish = async () => {
            const cartforUser = await Cart.findById(req.currentUser!.id).populate("info.product")
            if (cartforUser) {
                new CartItemReceivedPublisher(natsWrapper.client).publish(cartforUser.toJSON())
            }
        }

        const selProduct = cart.info.find(c => c.product._id == productId)

        if (selProduct) {
            const otherProducts = cart.info.filter(c => c.product._id != productId)

            await Cart.findOneAndUpdate(
                {
                    _id: req.currentUser!.id,
                    "info.product": productId
                }
                , {
                    $set: {
                        info: otherProducts
                    }
                });

            publish()
            res.status(204).send({})
        }
    })

export { router as removeRouter }