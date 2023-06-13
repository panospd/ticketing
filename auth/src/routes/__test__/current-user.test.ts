import request from "supertest"
import { app } from "../../app"

it("responds with details about the current user", async () => {
    const email = "panos@domain.com"
    const cookie = await signin(email)

    const res = await request(app)
        .get("/api/users/current")
        .set("Cookie", cookie)
        .expect(400)

    expect(res.body.currentUser.email).toEqual(email)
})

it("responds with null if not authenticated", async () => {
    const res = await request(app)
        .get("/api/users/current")
        .expect(200)

    expect(res.body.currentUser).toBeFalsy()
})
