import jwt from "jsonwebtoken"
import User from "../models/User.js"


export const protectRoute = async function (req,res,next){
    try {
        const token = req.cookies.jwt

        if(!token){
            return res
            .status(401)
            .json(
                {
                    message:"Unautherized - No Token provided"
                }
            )
        }

        const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY)

        if(!decoded){
            return res
            .status(401)
            .json(
                {
                    message:"Unautherized - Invalid Token"
                }
            )
        }

        const user = await User.findById(decoded.userId).select("-password")

        if(!user){
            return res
            .status(401)
            .json(
                {
                    message:"Unautherized - User not found"
                }
            )
        }

        req.user = user;
        next();
    } catch (error) {
        console.log("Middleware Error",error);
        
        return res
            .status(500)
            .json(
                {
                    message:"Internal Error"
                }
            )
    }
}