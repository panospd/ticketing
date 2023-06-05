import mongoose, { set } from "mongoose";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper"
import { ExpirationCompleteListener } from "../expiration-complete-listener"
import { Order, OrderStatus } from "../../../models/order";
import { ExpirationCompleteEvent } from "@ticketingpd/common";
import { Message } from "node-nats-streaming";

const setup = async () => {
    const listener = new ExpirationCompleteListener(natsWrapper.client);

    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: "concert",
        price: 20
    })

    await ticket.save();

    const order = Order.build({
        userId: new mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        expiresAt: new Date(),
        ticket: ticket
    });

    await order.save();

    const data: ExpirationCompleteEvent["data"] = {
        orderId: order.id
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, order, ticket, data, msg }
}

it("Updates the order status to cancelled", async () => {
    const { listener, order, ticket, data, msg } = await setup();

    await listener.onMessage(data, msg)

    const updatedOrder = await Order.findById(order.id)

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
})

it("Emits an OrderCancelled event", async () => {
    const { listener, order, ticket, data, msg } = await setup();

    await listener.onMessage(data, msg)

    expect(natsWrapper.client.publish).toHaveBeenCalledTimes(1)

    const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1])

    expect(eventData.id).toEqual(order.id)
})

it("acks the message", async () => {
    const { listener, order, ticket, data, msg } = await setup();

    await listener.onMessage(data, msg)

    expect(msg.ack).toHaveBeenCalledTimes(1)
})