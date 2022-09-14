import { Subjects, Publisher, ProductDeletedEvent } from "@lightningtools/common"

export class ProductDeletedPublisher extends Publisher<ProductDeletedEvent> {
    subject: Subjects.ProductDeleted = Subjects.ProductDeleted
} 