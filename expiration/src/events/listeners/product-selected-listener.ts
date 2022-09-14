import { Message } from 'node-nats-streaming'

import { Subjects, Listener, ProductSelectedEvent } from "@lightningtools/common"
import { queueGroupName } from "./queue-group-name"
import { expirationQueue } from '../../queues/expiration-queue'

export class ProductSelectedListener extends Listener<ProductSelectedEvent> {
    subject: Subjects.ProductSelected = Subjects.ProductSelected
    queueGroupName = queueGroupName

    async onMessage(data: ProductSelectedEvent['data'], msg: Message) {
        const delay = new Date(data.expiresAt).getTime() - new Date().getTime()
        console.log("Waiting this many milliseconds to process the job", delay)

        await expirationQueue.add({
            productId: data.productId,
            categoryId: data.categoryId,
            views: data.views
        },
            {
                delay
            })

        msg.ack()
    }
}
