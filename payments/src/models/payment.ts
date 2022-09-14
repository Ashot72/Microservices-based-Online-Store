import mongoose from 'mongoose'

interface PaymentAttrs {
    userId: string,
    stripeId: string
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

export interface PaymentDoc extends mongoose.Document {
    userId: string,
    stripeId: string
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

interface PaymentModel extends mongoose.Model<PaymentDoc> {
    build(attrs: PaymentAttrs): PaymentDoc
}

const paymentSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    stripeId: {
        required: true,
        type: String
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

}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id
            delete ret._id
        }
    }
})

paymentSchema.statics.build = (attrs: PaymentAttrs) => new Payment(attrs)

const Payment = mongoose.model<PaymentDoc, PaymentModel>('Payment', paymentSchema)

export { Payment }

