import { Publisher, Subjects, TicketUpdatedEvent } from "@ticketingpd/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>
{
    readonly subject = Subjects.TicketUpdated;
}