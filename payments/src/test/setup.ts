import { MongoMemoryServer } from "mongodb-memory-server"
import mongoose from "mongoose"
import jwt from "jsonwebtoken"

declare global {
    var signin: (id?: string, email?: string) => string[];
}

global.signin = (id?: string, email?: string) => {
    if (!email) {
        email = "test@test.com"
    }

    if (!id) {
        id = new mongoose.Types.ObjectId().toHexString()
    }

    const token = jwt.sign({
        id,
        email,
    }, process.env.JWT_KEY!)

    const sessionJson = JSON.stringify({ jwt: token })
    const base64 = Buffer.from(sessionJson).toString("base64")

    return [`session=${base64}`];
}

jest.mock("../nats-wrapper")

let mongo: MongoMemoryServer;

beforeAll(async () => {
    process.env.JWT_KEY = "asdf"
    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();

    await mongoose.connect(mongoUri, {})
})

beforeEach(async () => {
    jest.clearAllMocks();
    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
        await collection.deleteMany({})
    }
})

afterAll(async () => {
    if (mongo) {
        await mongo.stop();
    }

    await mongoose.connection.close()
})