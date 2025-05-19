import express from 'express';
import { login, logout, signup,onboard } from '../controllers/auth.controllers.js';
import { protectRoute } from '../middleware/auth.middleware.js';


const router = express.Router()

// TODO : add forgot password and reset password routes
// TODO : add email verification and resend email verification routes
// TODO : add social login routes

router.post("/signup", signup)
router.post("/login", login)
router.post("/logout",logout)

router.post("/onboarding",protectRoute,onboard)

router.get("/me",protectRoute,(req,res)=>{
    res.status(200).json({
        success:true,
        user:req.user
    })
})

export default router