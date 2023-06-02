import { Publisher, Subjects, TicketCreatedEvent } from "@ticketingpd/common";
import { Ticket } from "../../models/ticket";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>
{
    readonly subject = Subjects.TicketCreated;
}