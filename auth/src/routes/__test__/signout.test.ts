import request from "supertest";
import { app } from "../../app";

it ("clear the cookie after signing out", async () => {
    const email = "test@test.com"
    const password = "password"

    const signupResponse = await request(app)
        .post("/api/users/signup")
        .send({
            email,
            password
        })
        .expect(201)

    expect(signupResponse.get("Set-Cookie")).toBeDefined()

    const signOutResponse = await request(app)
        .post("/api/users/signout")
        .send({})
        .expect(200)

    expect(signOutResponse.get("Set-Cookie")[0]).toEqual("session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly")
})