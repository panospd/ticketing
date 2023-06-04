import { OrderCreatedEvent, Publisher, Subjects } from "@ticketingpd/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent>
{
    readonly subject = Subjects.OrderCreated;
}