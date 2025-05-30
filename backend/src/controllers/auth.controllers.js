import { upsertStreanUser } from "../lib/stream.js";
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
    // First check if password exists
if (!password) {
    return res.status(400).json({
        message: "Password is required"
    });
}

// Check type - ensure password is a string
if (typeof password !== 'string') {
    return res.status(400).json({
        message: "Password must be a string"
    });
}

    if(password.length< 6){// check password is number
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

    try {
        
        await upsertStreanUser({
            id:newUser._id.toString(),
            name:newUser.fullName,
            images:newUser.profilePicture || ""
        })
        console.log(`Stream user created for ${newUser.fullName}`);
        
    } catch (error) {
        console.log("Error creating Stream user",error);
        
    }

    const token = jwt.sign({
        userId:newUser._id
    },process.env.JWT_SECRET_KEY,{
        expiresIn:"7d"
    })






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
    try {
        const { email,password} = req.body

        if(!email || !password){
            return res.status(400).json({
                message:"All fields required"
            })
        }

        const user = await User.findOne({email})

        if(!user){
            return res.status(401).json({
                message:"Invalid email or password"
            })
        }

        const isPasswordCorrect = await user.matchPassword(password)

        if(!isPasswordCorrect)return res.status(401).json({message:"Invalid email or password"})

                const token = jwt.sign({
        userId:user._id
    },process.env.JWT_SECRET_KEY,{
        expiresIn:"7d"
    })




    res.cookie("jwt",token,{
        maxAge: 7 *24 *60 *60 * 1000,
        httpOnly:true, // prevent XSS attacks,
        sameSite:"strict", // prevent CSRF attcks
        secure:process.env.NODE_ENV === "production"
    })

    res.status(200).json({
        success: true,
        user
    })


    } catch (error) {
        console.log("Error in Login ",error)
        res.status(500).json({
            message:"Internal Server Error"
        });
        
    }
}
export async function logout(req, res) {
    try {
        res.clearCookie("jwt", {
            httpOnly: true,
            secure: true,
            sameSite: "None",
        });

        return res.status(200).json({
            success: true,
            message: "Logout successful",
        });
    } catch (error) {
        console.error("Logout error:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong during logout.",
        });
    }
}


export async function onboard(req,res){
    console.log(req.user)
    
    try {
        const userId = req.user._id

        const { fullName,bio,nativeLanguage,learningLanguage,location} = req.body

        if(!fullName || !bio || !nativeLanguage || !learningLanguage || !location){

            return res.status(400).json({
                message:"All fields are required",
                missingFields:[
                    !fullName && "fullName",
                    !bio && "bio",
                    !nativeLanguage && "nativeLanguage",
                    !learningLanguage && "learningLanguage",
                    !location && "location"
                ],
            })
        }


        const updatedUser = await User.findByIdAndUpdate(userId,{
            ...req.body,
            isOnboarded:true
        },{
            new:true
        })


        if(!updatedUser){
            return res.status(404).json({
                message:"User not found"
            })
        }
// TODO :   update the user info in strean

        try {
            await upsertStreanUser({
                id:updatedUser._id.toString(),
                name:updatedUser.fullName,
                images:updatedUser.profilePicture || ""
            })
            console.log(`Stream user updated for ${updatedUser.fullName}`);
        } catch (error) {
            console.log("Error updating Stream user",error);

            
        }

        res.status(200).json({
            success:true,
            message:"User is onboarded",    
            user:updatedUser
        })
    } catch (error) {
        console.log("Error in onboarding user",error);
        res.status(500).json({
            message:"Internal server error"
        })
        
    };
    
}