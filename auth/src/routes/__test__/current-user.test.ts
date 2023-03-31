import request from "supertest"
import { app } from "../../app"

it("responds with details about the current user", async () => {
    const email = "test@test.com"
    const authResponse = await request(app)
        .post("/api/users/signup")
        .send({
            email,
            password: "password"
        })
        .expect(201)

    const cookie = authResponse.get("Set-Cookie")

    const res = await request(app)
        .get("/api/users/current")
        .set("Cookie", cookie)
        .expect(200)

    expect(res.body.currentUser.email).toEqual(email)
})
