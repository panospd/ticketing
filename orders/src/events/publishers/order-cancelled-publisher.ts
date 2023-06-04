import { OrderCancelledEvent, Publisher, Subjects } from "@ticketingpd/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent>
{
    readonly subject = Subjects.OrderCancelled;
}