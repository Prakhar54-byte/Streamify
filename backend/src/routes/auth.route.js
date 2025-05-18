import express from 'express';

const router = express.Router()


router.get("/signup", (req, res) => {
    res.send("SignUp  World")
})
router.get("/login", (req, res) => {
    res.send("login  World")
})
router.get("/logout", (req, res) => {
    res.send("logout  World")
})

export default router