import { Message } from 'node-nats-streaming'
import { queueGroupName } from './queue-group-name'
import { Subjects, Listener, CartItemReceivedEvent } from "@lightningtools/common"
import { Cart } from '../../models/cart'

export class CartItemReceivedListener extends Listener<CartItemReceivedEvent> {
    subject: Subjects.CartItemReceived = Subjects.CartItemReceived
    queueGroupName = queueGroupName

    async onMessage(data: CartItemReceivedEvent['data'], msg: Message) {
        const { id, info } = data

        if (!info[0]) {
            await Cart.findByIdAndDelete(id)
        }
        else {
            await Cart.findOneAndUpdate(
                {
                    _id: id
                }
                , {
                    $set: {
                        info
                    }
                }, { upsert: true, new: true, setDefaultsOnInsert: true });
        }

        msg.ack()
    }
}

