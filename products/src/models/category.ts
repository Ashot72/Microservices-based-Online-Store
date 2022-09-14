import mongoose from 'mongoose'

interface CategoryAttrs {
    name: string
    description: string
    userId: string
}

export interface CategoryDoc extends mongoose.Document {
    name: string
    description: string
    userId: string
}

interface CategoryModel extends mongoose.Model<CategoryDoc> {
    build(attrs: CategoryAttrs): CategoryDoc
    deleteById: (id: string) => Promise<void>
}

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    userId: {
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

categorySchema.statics.build = (attrs: CategoryAttrs) => new Category(attrs)

categorySchema.statics.deleteById = function (_id) {
    return this.deleteOne({ _id })
}

const Category = mongoose.model<CategoryDoc, CategoryModel>("Category", categorySchema)

export { Category }