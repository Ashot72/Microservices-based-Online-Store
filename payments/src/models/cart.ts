import mongoose, { Model, model, Schema } from 'mongoose'

export interface CartDoc extends mongoose.Document {
    id: string
    info: {
        product: {
            id: string,
            name: string,
            description: string,
            price: number
            picture: string
            categoryId: string
        },
        qty: number
    }[]
}

interface CartModel extends mongoose.Model<CartDoc> { }

const cartSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    info: [{
        product: {
            id: {
                type: String,
                required: true
            },
            name: {
                type: String,
                required: true
            },
            description: {
                type: String,
                required: true
            },
            picture: {
                type: String,
                required: true
            },
            price: {
                type: Number,
                required: true
            },
            categoryId: {
                type: String,
                required: true
            }
        },
        qty: {
            type: Number,
            required: true
        }
    }]
})

const Cart = mongoose.model<CartDoc, CartModel>('Cart', cartSchema)

export { Cart }