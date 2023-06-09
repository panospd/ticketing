import { PaymentCreatedEvent, Publisher, Subjects } from "@ticketingpd/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent>
{
    readonly subject = Subjects.PaymentCreated;
}