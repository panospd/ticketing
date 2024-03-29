import nats from "node-nats-streaming"
import { TicketCreatedPublisher } from "./events/ticket-created-publisher"

const stan = nats.connect("ticketing", "abc", {
    url: "http://localhost:4222"
})

console.clear()

stan.on("connect", async () => {
    console.log("Publisher connected to NATS")

    const data = {
        id: "123",
        title: "concert",
        price: 20
    }

    await new TicketCreatedPublisher(stan).publish(data);
})