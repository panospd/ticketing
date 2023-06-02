import mongoose from "mongoose"
import { app } from "./app";
import { natsWrapper } from "../nats-wrapper";

const start = async () => {
    try {

        if (!process.env.JWT_KEY) {
            throw new Error('JWT_KEY must be defined')
        }

        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI must be defined')
        }

        await natsWrapper.connect("ticketing", "ticket-service-id", "http://nats-srv:4222")
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Connected to MongoDb...")
        app.listen(3000, () => {
            console.log("Listening on port 3000!!!!!!")
        })
    } catch (error) {
        console.log(error)
    }
}

start()

