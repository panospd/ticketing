import { Listener, Subjects, TicketUpdatedEvent } from "@ticketingpd/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent>
{
    readonly subject = Subjects.TicketUpdated;
    readonly queueGroupName = queueGroupName

    async onMessage(
        data: TicketUpdatedEvent["data"],
        msg: Message): Promise<void> {
        const { title, price } = data;

        const ticket = await Ticket.findByEvent(data)

        if (!ticket) {
            throw new Error("Ticket not found")
        }

        ticket.set({ title, price })

        await ticket.save()

        msg.ack()
    }

}