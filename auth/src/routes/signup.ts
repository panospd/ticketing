import express from 'express'

const router = express.Router()

router.post("/api/users/signup", (req, res) => {
    res.send("This is signup!")
})

export { router as signupRouter }