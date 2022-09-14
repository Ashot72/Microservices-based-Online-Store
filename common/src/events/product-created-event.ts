import { Subjects } from "./subjects";

export interface ProductCreatedEvent {
    subject: Subjects.ProductCreated
    data: {
        id: string
        name: string
        description: string
        price: number
        picture: string
        userId: string
        categoryId: string,
        count: number,
        version?: number
    }
}