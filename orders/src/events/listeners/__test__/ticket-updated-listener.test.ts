import { TicketUpdatedEvent } from "@ticketingpd/common"
import { natsWrapper } from "../../../nats-wrapper"
import mongoose, { mongo } from "mongoose"
import { Message } from "node-nats-streaming"
import { Ticket } from "../../../models/ticket"
import { TicketUpdatedListener } from "../ticket-updated-listener"

const setup = async () => {

    const listener = new TicketUpdatedListener(natsWrapper.client)

    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        price: 20,
        title: "concert"
    })

    await ticket.save();

    const data: TicketUpdatedEvent["data"] = {
        id: ticket.id,
        version: ticket.version + 1,
        title: "concert_updated",
        price: 17,
        userId: new mongoose.Types.ObjectId().toHexString()
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, ticket, data, msg }
}

it("finds, updates and saves a ticket", async () => {
    const { listener, ticket, data, msg } = await setup();

    await listener.onMessage(data, msg)

    const updatedTicket = await Ticket.findById(ticket.id)

    expect(updatedTicket!.title).toEqual(data.title)
    expect(updatedTicket!.price).toEqual(data.price)
    expect(updatedTicket!.version).toEqual(data.version)
})

it("acks the message", async () => {
    const { listener, ticket, data, msg } = await setup()

    await listener.onMessage(data, msg)

    expect(msg.ack).toHaveBeenCalledTimes(1)
})

it("does not ack the message, if the event has a skipped version number", async () => {
    const { listener, ticket, data, msg } = await setup()

    data.version = 10

    try {
        await listener.onMessage(data, msg)
    } catch (error) {

    }

    expect(msg.ack).not.toHaveBeenCalled()
})