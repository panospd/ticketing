import { OrderCancelledEvent, OrderCreatedEvent, OrderStatus } from "@ticketingpd/common"
import { natsWrapper } from "../../../nats-wrapper"
import mongoose from "mongoose"
import { Message } from "node-nats-streaming"
import { Order } from "../../../models/order"
import { OrderCancelledListener } from "../order-cancelled-listener"

const setup = async () => {
    const listener = new OrderCancelledListener(natsWrapper.client)

    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        price: 20,
        status: OrderStatus.Created,
        userId: new mongoose.Types.ObjectId().toHexString()
    })

    await order.save();

    const data: OrderCancelledEvent["data"] = {
        id: order.id,
        version: order.version + 1,
        ticket: {
            id: new mongoose.Types.ObjectId().toHexString(),
        }
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, order, data, msg }
}

it("cancels the order", async () => {
    const { listener, order, data, msg } = await setup()

    await listener.onMessage(data, msg)

    const updatedOrder = await Order.findById(data.id)

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
})

it("acks the message", async () => {
    const { listener, data, msg } = await setup()

    await listener.onMessage(data, msg)

    expect(msg.ack).toHaveBeenCalledTimes(1)
})