import { Subjects } from "./subjects";

export interface ProductUpdatedEvent {
    subject: Subjects.ProductUpdated
    data: {        
        id: string
        name: string
        description: string
        price: number
        picture: string
        userId: string
        categoryId: string,
        count: number,
        version: number
    }
}