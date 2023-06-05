import { Listener, OrderCreatedEvent, OrderStatus, Subjects } from "@ticketingpd/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";

export class OrderCreatedListener extends Listener<OrderCreatedEvent>
{
    readonly subject = Subjects.OrderCreated;
    readonly queueGroupName = queueGroupName;
    async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
        const ticket = await Ticket.findById(data.ticket.id);

        if (!ticket) {
            throw new Error("Ticket not found.")
        }

        ticket.set({ orderId: data.id })

        await ticket.save();

        msg.ack()
    }
}