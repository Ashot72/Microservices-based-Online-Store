import { Message } from 'node-nats-streaming'
import { Subjects, Listener, AddToCartEvent } from "@lightningtools/common"
import { natsWrapper } from '../../nats-wrapper'
import { Cart } from '../../models/cart'
import { Product } from '../../models/product'
import { CartItemReceivedPublisher } from '../publishers/cart-item-received-publisher'
import { queueGroupName } from "./queue-group-name"

export class AddToCartListener extends Listener<AddToCartEvent> {
    subject: Subjects.AddToCart = Subjects.AddToCart
    queueGroupName = queueGroupName

    async onMessage(data: AddToCartEvent['data'], msg: Message) {
        const { productId, userId } = data

        let cart = await Cart.findOne({ _id: userId, "info.product": productId })

        let product = await Product.findById(productId)

        if (!product) {
            throw new Error('product not found!')
        }

        const publish = async () => {
            const cartforUser = await Cart.findById(userId).populate("info.product")

            if (cartforUser) {
                new CartItemReceivedPublisher(natsWrapper.client).publish(cartforUser.toJSON())
            }
        }

        if (cart) {
            const selProduct = cart.info.find(c => c.product._id == productId)
            if (selProduct) {
                if (product.count > selProduct.qty) {
                    await Cart.findOneAndUpdate(
                        {
                            _id: userId,
                            "info.product": productId
                        }
                        , {
                            $set: {
                                "info.$.qty": selProduct.qty + 1,
                                "info.$.limit": false
                            }
                        });

                    publish()
                } else {
                    await Cart.findOneAndUpdate(
                        {
                            _id: userId,
                            "info.product": productId
                        }
                        , {
                            $set: {
                                "info.$.limit": true
                            }
                        });
                }
            }
        } else {
            await Cart.findOneAndUpdate(
                {
                    _id: userId
                }
                , {
                    $push: {
                        info: {
                            product,
                            qty: 1,
                            limit: false
                        }
                    }
                }
                , { upsert: true, new: true, setDefaultsOnInsert: true }
            );

            publish()
        }

        msg.ack()
    }
}
