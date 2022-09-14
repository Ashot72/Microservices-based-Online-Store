import { Subjects, Publisher, ProductUpdatedEvent } from "@lightningtools/common"

export class ProductUpdatedPublisher extends Publisher<ProductUpdatedEvent> {
    subject: Subjects.ProductUpdated = Subjects.ProductUpdated
} 