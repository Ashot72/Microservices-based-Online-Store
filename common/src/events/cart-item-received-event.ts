import { Subjects } from "./subjects";

export interface CartItemReceivedEvent {
    subject: Subjects.CartItemReceived
    data: {
        id: string,
        info: [{
            product: {
                id: string,
                name: string,
                description: string,
                price: string
                picture: string
                count: number
                categoryId: string
                version: string
            },
            qty: number
            id: string
        }]
    }
}