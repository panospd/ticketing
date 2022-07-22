import request from "supertest";
import { app } from "../../app";

it("fails when a email that does not exist is supplied", async () => {
    await request(app)
        .post("/api/users/signin")
        .send({
            email: "test@test.com",
            password: "password"
        })
        .expect(400)
})

it("fails when an incorrect password is supplied", async () => {
    const email = "test@test.com"
    const password = "password"

    await request(app)
        .post("/api/users/signup")
        .send({
            email,
            password
        })
        .expect(201)

    await request(app)
        .post("/api/users/signin")
        .send({
            email,
            password: password + "bad"
        })
        .expect(400)
})

it ("responds with a cookie when given valid credetials", async () => {
    const email = "test@test.com"
    const password = "password"

    await request(app)
        .post("/api/users/signup")
        .send({
            email,
            password
        })
        .expect(201)

    const response = await request(app)
        .post("/api/users/signin")
        .send({
            email,
            password: password
        })
        .expect(200)

        expect(response.get("Set-Cookie")).toBeDefined()
})