import request from "supertest"
import { app } from "../../app"

it("returns a 201 on successful signup",async () => {
    return request(app)
        .post("/api/users/signup")
        .send({
            email: "panos@domain.com",
            password: "123456789"
        })
        .expect(201)
})

it("returns a 400 with an ivalid email",async () => {
    return request(app)
        .post("/api/users/signup")
        .send({
            email: "panosdomain.com",
            password: "123456789"
        })
        .expect(400)
})

it("returns a 400 with an ivalid password",async () => {
    return request(app)
        .post("/api/users/signup")
        .send({
            email: "panos@domain.com",
            password: "1"
        })
        .expect(400)
})

it("returns a 400 with missing email and password",async () => {
    return request(app)
        .post("/api/users/signup")
        .send({})
        .expect(400)
})

it("dissallowes duplicate emails", async () => {
    await request(app)
    .post("/api/users/signup")
    .send({
        email: "panos@domain.com",
        password: "123456789"
    })
    .expect(201)

    await request(app)
    .post("/api/users/signup")
    .send({
        email: "panos@domain.com",
        password: "123456789"
    })
    .expect(400)
})

it("sets a cookie after succussful signup", async () => {
    const respose = await request(app)
    .post("/api/users/signup")
    .send({
        email: "panos@domain.com",
        password: "123456789"
    })
    .expect(201)

    expect(respose.get("Set-Cookie")).toBeDefined();
})