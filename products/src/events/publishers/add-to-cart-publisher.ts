import { Publisher, Subjects, AddToCartEvent } from "@lightningtools/common"

export class AddToCartPublisher extends Publisher<AddToCartEvent> {
    subject: Subjects.AddToCart = Subjects.AddToCart
}