import request from "supertest"
import { app } from "../../app"
import mongoose from "mongoose"
import { natsWrapper } from "../../nats-wrapper"

it("returns a 404 if the provided id does not exist", async () => {
    const id = new mongoose.Types.ObjectId().toHexString()
    await request(app)
        .put(`/api/tickets/${id}`)
        .set("Cookie", signin())
        .send({
            title: "title",
            price: 20
        })
        .expect(404)
})

it("returns a 401 if the user is not authenticated", async () => {
    const id = new mongoose.Types.ObjectId().toHexString()
    await request(app)
        .put(`/api/tickets/${id}`)
        .send({
            title: "title",
            price: 20
        })
        .expect(401)
})

it("returns a 401 if the user does not own the ticket", async () => {
    const user1Cookie = signin()

    const res = await request(app)
        .post("/api/tickets")
        .set("Cookie", user1Cookie)
        .send({ title: "title", price: 6 })
        .expect(201)

    const user2Cookie = signin()

    await request(app)
        .put(`/api/tickets/${res.body.id}`)
        .set("Cookie", user2Cookie)
        .send({
            title: "title_updated",
            price: 20
        })
        .expect(401)
})

it("returns a 400 if the user provided an invalid title or price", async () => {
    const cookie = signin();
    const res = await request(app)
        .post("/api/tickets")
        .set("Cookie", cookie)
        .send({ title: "title", price: 6 })
        .expect(201)

    await request(app)
        .put(`/api/tickets/${res.body.id}`)
        .set("Cookie", cookie)
        .send({
            title: "",
            price: 20
        })
        .expect(400)

    await request(app)
        .put(`/api/tickets/${res.body.id}`)
        .set("Cookie", cookie)
        .send({
            title: "title_updated",
            price: -10
        })
        .expect(400)
})

it("updates the ticket provided valid inputs", async () => {
    const cookie = signin();
    const res = await request(app)
        .post("/api/tickets")
        .set("Cookie", cookie)
        .send({ title: "title", price: 6 })
        .expect(201)

    const updateReponse = await request(app)
        .put(`/api/tickets/${res.body.id}`)
        .set("Cookie", cookie)
        .send({
            title: "title_updated",
            price: 20
        })
        .expect(200)

    expect(updateReponse.body.title).toEqual("title_updated")
    expect(updateReponse.body.price).toEqual(20)
})

it("publishes an event", async () => {
    const cookie = signin();
    const res = await request(app)
        .post("/api/tickets")
        .set("Cookie", cookie)
        .send({ title: "title", price: 6 })
        .expect(201)

    expect(natsWrapper.client.publish).toHaveBeenCalledTimes(1);

    const updateReponse = await request(app)
        .put(`/api/tickets/${res.body.id}`)
        .set("Cookie", cookie)
        .send({
            title: "title_updated",
            price: 20
        })
        .expect(200)

    expect(natsWrapper.client.publish).toHaveBeenCalledTimes(2);
})