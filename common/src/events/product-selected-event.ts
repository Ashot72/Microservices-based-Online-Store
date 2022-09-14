import { Subjects } from "./subjects";

export interface ProductSelectedEvent {
    subject: Subjects.ProductSelected
    data: {
        productId: string,
        views: number,
        userId: string,
        categoryId: string
        expiresAt: string
    }
}