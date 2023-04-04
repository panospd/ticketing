import { currentUser } from "@ticketingpd/common";
import express from "express"

const router = express.Router();

router.get("/api/users/current", currentUser, (req, res) => {
    res.send({ currentUser: req.currentUser })
})

export { router as currentUserRouter }