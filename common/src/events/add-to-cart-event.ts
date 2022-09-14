import { Subjects } from "./subjects";

export interface AddToCartEvent {
    subject: Subjects.AddToCart
    data: {
        productId: string,
        name: string,
        description: string,
        price: number,
        userId: string,
        picture: string
        categoryId: string,
        version: number,
        count: number
    }
}