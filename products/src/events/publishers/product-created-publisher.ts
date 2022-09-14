import { Subjects, Publisher, ProductCreatedEvent } from "@lightningtools/common"

export class ProductCreatedPublisher extends Publisher<ProductCreatedEvent> {
    subject: Subjects.ProductCreated = Subjects.ProductCreated
} 