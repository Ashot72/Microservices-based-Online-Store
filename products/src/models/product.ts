import mongoose from 'mongoose'
import { updateIfCurrentPlugin } from "mongoose-update-if-current"
import { CategoryDoc } from './category'

export interface ProductAttrs {
    name: string
    description: string
    price: number
    picture: string
    userId: string
    category: CategoryDoc,
    count: number,
    views: number
}

export interface ProductDoc extends mongoose.Document {
    name: string
    description: string
    price: number
    picture: string
    userId: string
    category: CategoryDoc,
    count: number,
    views: number,
    version: number
}

interface ProductModel extends mongoose.Model<ProductDoc> {
    build(attrs: ProductAttrs): ProductDoc
    deleteById: (id: string) => Promise<void>
}

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    picture: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    views: {
        type: Number,
        default: 0
    },
    count: {
        type: Number,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id
            delete ret._id
        }
    }
})

productSchema.set('versionKey', 'version')
productSchema.plugin(updateIfCurrentPlugin)

productSchema.statics.build = (attrs: ProductAttrs) => new Product(attrs)

productSchema.statics.deleteById = function (_id: string) {
    return this.deleteOne({ _id })
}

const Product = mongoose.model<ProductDoc, ProductModel>('Product', productSchema)

export { Product }
