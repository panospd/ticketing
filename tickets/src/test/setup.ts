import { MongoMemoryServer } from "mongodb-memory-server"
import mongoose from "mongoose"
import jwt from "jsonwebtoken"

declare global {
    var signin: (email?: string) => string[];
}

global.signin = (email?: string) => {
    if (!email) {
        email = "test@test.com"
    }

    const token = jwt.sign({
        id: new mongoose.Types.ObjectId().toHexString(),
        email,
    }, process.env.JWT_KEY!)

    const sessionJson = JSON.stringify({ jwt: token })
    const base64 = Buffer.from(sessionJson).toString("base64")

    return [`session=${base64}`];
}

let mongo: MongoMemoryServer;

beforeAll(async () => {
    process.env.JWT_KEY = "asdf"
    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();

    await mongoose.connect(mongoUri, {})
})

beforeEach(async () => {
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