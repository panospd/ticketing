import { MongoMemoryServer } from "mongodb-memory-server"
import mongoose from "mongoose"
import { app } from "../app"
import request from "supertest"

declare global {
    var signin: (email?: string) => Promise<string[]>;
}

global.signin = async (email?: string) => {
    if (!email) {
        email = "test@test.com"
    }
    const password = "password"

    const res = await request(app)
        .post("/api/users/signup")
        .send({ email, password })
        .expect(201)

    return res.get("Set-Cookie")
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