import { Subjects } from "./subjects";

export interface PaymentCreatedEvent {
    subject: Subjects.PaymentCreated
    data: {
        id: string,
        userId: string,
        stripeId: string
    }
}