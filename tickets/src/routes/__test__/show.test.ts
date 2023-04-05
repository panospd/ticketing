import request from "supertest"
import { app } from "../../app"
import mongoose from "mongoose"

it("returns a 404 if ticket is not found", async () => {
    const nonExistingTicketId = "fdafdsafdasfsa" // new mongoose.Types.ObjectId().toString()
    await request(app)
        .get(`/api/tickets/${nonExistingTicketId}`)
        .send()
        .expect(404)
})

it("returns the ticket if the ticket is found", async () => {
    const title = "concert"
    const price = 20
    const response = await request(app)
        .post("/api/tickets")
        .set("Cookie", signin())
        .send({
            title,
            price
        })
        .expect(201)

    const getResponse = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .send()
        .expect(200)

    expect(getResponse.body.title).toEqual(title)
    expect(getResponse.body.price).toEqual(price)
})