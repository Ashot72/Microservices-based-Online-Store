import { Publisher, Subjects, CartItemReceivedEvent } from "@lightningtools/common"

export class CartItemReceivedPublisher extends Publisher<CartItemReceivedEvent> {
    subject: Subjects.CartItemReceived = Subjects.CartItemReceived
}