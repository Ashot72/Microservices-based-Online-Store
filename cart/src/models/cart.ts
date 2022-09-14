import mongoose from 'mongoose'
import { ProductDoc } from './product'

export interface CartDoc extends mongoose.Document {
    userId: string
    version?: number
    info: { product: ProductDoc, qty: number, limit: boolean }[],
}

interface CartModel extends mongoose.Model<CartDoc> { }

const cartSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    info: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        qty: {
            type: Number,
            required: true
        },
        limit: {
            type: Boolean
        }
    }]
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id
            delete ret._id
        }
    }
})

const Cart = mongoose.model<CartDoc, CartModel>('Cart', cartSchema)

export { Cart }