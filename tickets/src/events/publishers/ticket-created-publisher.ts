import { Publisher, Subjects, TicketCreatedEvent } from "@ticketingpd/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>
{
    readonly subject = Subjects.TicketCreated;
}