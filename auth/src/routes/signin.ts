import express from 'express'

const router = express.Router()

router.post("/api/users/signin", (req, res) => {
    res.send("This is signin!")
})

export { router as signinRouter }