import { Message } from 'node-nats-streaming'
import { Subjects, Listener, ProductCreatedEvent } from "@lightningtools/common"
import { Product } from '../../models/product'
import { queueGroupName } from './queue-group-name'

export class ProductCreatedListener extends Listener<ProductCreatedEvent> {
    subject: Subjects.ProductCreated = Subjects.ProductCreated
    queueGroupName = queueGroupName

    async onMessage(data: ProductCreatedEvent['data'], msg: Message) {
        const { id, name, description, price, picture, categoryId, count } = data

        const product = Product.build({
            id,
            name,
            description,
            price,
            picture,
            categoryId,
            count
        })

        await product.save()

        msg.ack()
    }
}
