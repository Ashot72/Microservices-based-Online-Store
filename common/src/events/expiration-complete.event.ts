import { Subjects } from "./subjects";

export interface ExpirationCompleteEvent {
    subject: Subjects.ExpirationComplete
    data: {
        productId: string
        categoryId: string
        views: number
    }
}