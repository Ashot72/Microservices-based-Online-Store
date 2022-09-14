import { Subjects, Publisher, ExpirationCompleteEvent } from "@lightningtools/common"

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete
}