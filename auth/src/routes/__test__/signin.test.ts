import request from "supertest"
import { app } from "../../app"

it("fails when an email that does not exist is supplied", async () => {
    return request(app)
        .post("/api/users/signin")
        .send({
            email: "test@test.com",
            password: "password"
        })
        .expect(400)
})

it("fails when an incorrect password is supplied", async () => {
    const email = "test@test.com"

    await request(app)
        .post("/api/users/signup")
        .send({
            email,
            password: "password"
        })
        .expect(201)

    return request(app)
        .post("/api/users/signin")
        .send({
            email,
            password: "invalid password"
        })
        .expect(400)
})

it("responds with a cookie when given valid credentials", async () => {
    const email = "test@test.com"
    const password = "password"
    
    await request(app)
        .post("/api/users/signup")
        .send({
            email,
            password
        })
        .expect(201)

    const res = await request(app)
        .post("/api/users/signin")
        .send({
            email,
            password
        })
        .expect(200)

    expect(res.get("Set-Cookie")).toBeDefined()
})