import Queue from 'bull'
import { ExpirationCompletePublisher } from '../events/publishers/expiration-complete-publisher'
import { natsWrapper } from "../nats-wrapper"

interface Payload {
    productId: string
    categoryId: string
    views: number
}

const expirationQueue = new Queue<Payload>('expiration:productView', {
    redis: {
        host: process.env.REDIS_HOST
    }
})

expirationQueue.process(async (job) => {
    console.log("Publishing an productView:complete event for productId", job.data.productId, job.data.views)

    new ExpirationCompletePublisher(natsWrapper.client).publish({
        productId: job.data.productId,
        categoryId: job.data.categoryId,
        views: job.data.views
    })
})

export { expirationQueue }