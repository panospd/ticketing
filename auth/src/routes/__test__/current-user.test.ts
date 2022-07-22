import request from "supertest";
import { app } from "../../app";

it("responds with details about the current user", async () => {
    const email = "test@test.com"

    const cookie = await signin()

    const userResponse = await request(app)
        .get("/api/users/currentuser")
        .set("Cookie", cookie)
        .send()
        .expect(200)

    expect(userResponse.body.currentUser.email).toEqual(email)
})

it("responds with null if not authenticated", async () => {
    const userResponse = await request(app)
        .get("/api/users/currentuser")
        .send()
        .expect(200)

    expect(userResponse.body.currentUser).toEqual(null)
})