import User from "../models/User.js";
import jwt from "jsonwebtoken"

export async function signup(req,res){
    const { fullName , email,password} = req.body
    try {
        if(!email || !fullName || !password){
            return res.status(400).json({
                message:"All fiels are empty"
            })
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailRegex.test(email)) {
  return res.status(400).json({ message: "Invalid email format" });
}


    if(password.length< 6){
        return res.status(400).json({
            message:"Password must be at least 6 character"
        })
    }

    const existingUser = await User.findOne({email})
    if(existingUser){
        return res.status(400).json({
            message:"Email is alredy exist"
        })
    }

    const index = Math.floor(Math.random() *100) + 1; //genetae number between 1 to 100 as api have 100 unique photos
    const randomAvatar = `https://avatar.iran.liara.run/public/${index}.png`

    const newUser = await User.create({
        email,
        fullName,
        password,
        profilePicture:randomAvatar
    })


    const token = jwt.sign({
        userId:newUser._id
    },process.env.JWT_SECRET_KEY,{
        expiresIn:"7d"
    })



    // TODO : CREATE THE USER IN STREAM AS WELL

    res.cookie("jwt",token,{
        maxAge: 7 *24 *60 *60 * 1000,
        httpOnly:true, // prevent XSS attacks,
        sameSite:"strict", // prevent CSRF attcks
        secure:process.env.NODE_ENV === "production"
    })


    res.status(201).json({
        success: true,
        message:"New User is created",
        user:newUser
    })
    } catch (error) {
        console.log("Error in sign up optins ",error);
        return res.status(500).json({
            message:"Internal server error"
        })
        
        
    }
}
export async function login(req,res){
    res.send("login  World")
}
export async function logout(req,res){
    res.send("logout  World")
}