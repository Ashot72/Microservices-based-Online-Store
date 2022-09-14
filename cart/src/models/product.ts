import mongoose from 'mongoose'
import { updateIfCurrentPlugin } from "mongoose-update-if-current"

interface ProductAttrs {
    id: string
    name: string
    description: string
    price: number
    picture: string
    categoryId: string,
    count: number
}

export interface ProductDoc extends mongoose.Document {
    name: string
    description: string
    price: number
    picture: string
    categoryId: string,
    count: number,
    version: number,
}

interface ProductModel extends mongoose.Model<ProductDoc> {
    build(attrs: ProductAttrs): ProductDoc
    deleteById: (id: string) => Promise<void>
    findByEvent(event: { id: string, version: number }): Promise<ProductDoc | null>
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
    count: {
        type: Number,
        required: true
    },
    categoryId: {
        type: String,
        required: true
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

productSchema.statics.build = (attrs: ProductAttrs) => new Product({
    _id: attrs.id,
    name: attrs.name,
    description: attrs.description,
    price: attrs.price,
    picture: attrs.picture,
    categoryId: attrs.categoryId,
    count: attrs.count
})

productSchema.statics.deleteById = function (_id: string) {
    return this.deleteOne({ _id })
}

productSchema.statics.findByEvent = (event: { id: string, version: number }) => {
    return Product.findOne({
        _id: event.id,
        version: event.version - 1
    })
}

const Product = mongoose.model<ProductDoc, ProductModel>('Product', productSchema)

export { Product }
