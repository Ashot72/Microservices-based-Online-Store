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

router.post("/api/cart/itemAddRemove",
    requireAuth,
    async (req: Request, res: Response) => {
        const { id: productId, add } = req.body
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
            if (selProduct.qty < 2 && add < 0) {
                const cardsRemoved = cart.info.filter(c => c.product._id != productId)

                await Cart.findOneAndUpdate(
                    {
                        _id: req.currentUser!.id,
                        "info.product": productId
                    }
                    , {
                        $set: {
                            "info": cardsRemoved
                        }
                    });

                publish()
                res.status(204).send({})
            } else {
                if (product.count > selProduct.qty) {
                    const cartUpdated = await Cart.findOneAndUpdate(
                        {
                            _id: req.currentUser!.id,
                            "info.product": productId
                        }
                        , {
                            $set: {
                                "info.$.qty": selProduct.qty + add,
                                "info.$.limit": false
                            }
                        });

                    publish()
                    res.send(cartUpdated)
                } else {
                    if (add < 0) {
                        const cartUpdated = await Cart.findOneAndUpdate(
                            {
                                _id: req.currentUser!.id,
                                "info.product": productId
                            }
                            , {
                                $set: {
                                    "info.$.qty": selProduct.qty + add,
                                    "info.$.limit": false
                                }
                            });

                        publish()
                        res.send(cartUpdated)
                    } else {
                        const cartUpdated = await Cart.findOneAndUpdate(
                            {
                                _id: req.currentUser!.id,
                                "info.product": productId
                            }
                            , {
                                $set: {
                                    "info.$.limit": true
                                }
                            });

                        res.send(cartUpdated)
                    }
                }
            }
        }
    })

export { router as addRemoveRouter }