import { generatedStreamToken } from "../lib/stream.js";



export async function getStreamToken(req,res){
    try {
        const token = generatedStreamToken(req.user.id)
        
        return res.status(200).json({
            token,
            userId: req.user.id
        });
    } catch (error) {
        console.log("Error in getStreamToken",error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
        
    }
}