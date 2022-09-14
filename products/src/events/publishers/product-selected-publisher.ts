import { Subjects, Publisher, ProductSelectedEvent } from "@lightningtools/common"

export class ProductSelectedPublisher extends Publisher<ProductSelectedEvent> {
    subject: Subjects.ProductSelected = Subjects.ProductSelected
} 