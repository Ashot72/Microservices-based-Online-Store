import { Subjects, Listener, PaymentCreatedEvent } from "@lightningtools/common"
import { Message } from 'node-nats-streaming'
import { queueGroupName } from "./queue-group-name";
import { Cart } from '../../models/cart';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated
    queueGroupName = queueGroupName

    async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
        const { userId } = data

        await Cart.findByIdAndDelete(userId)

        msg.ack()
    }
}