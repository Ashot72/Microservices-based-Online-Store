import { Message } from 'node-nats-streaming'
import { Subjects, Listener, ExpirationCompleteEvent } from "@lightningtools/common"
import { Product } from '../../models/product'
import { natsWrapper } from '../../nats-wrapper'
import { ProductUpdatedPublisher } from '../publishers/product-updated-publisher'
import { queueGroupName } from './queue-group-name'

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
    queueGroupName = queueGroupName
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete

    async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
        const product = await Product.findById(data.productId)

        if (!product) {
            throw new Error("Product not found")
        }

        product.set({ views: product.views - 1 })
        await product.save()

        new ProductUpdatedPublisher(natsWrapper.client).publish({
            id: product.id,
            name: product.name,
            description: product.description,
            categoryId: data.categoryId,
            picture: product.picture,
            price: product.price,
            userId: product.userId,
            count: product.count,
            version: product.version!
        })

        msg.ack()
    }
}