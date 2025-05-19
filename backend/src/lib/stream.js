import {StreamChat} from 'stream-chat'
import "dotenv/config.js"


const apiKey = process.env.STREAM_API_KEY
const apiSecret = process.env.STREAM_API_SECRET

if(!apiKey || !apiSecret){
    console.error("Stream API key or sectre is missing")
}

const streamClient = StreamChat.getInstance(apiKey,apiSecret)

export const upsertStreanUser = async (userData) => {
    try {
        await streamClient.upsertUsers([userData]);
        return userData
    } catch (error) {
        console.log("Error upserting Stream user",error);
        
    }
}


export const generatedStreamToken = (userId) => {
    try {
        if(!userId){
            throw new Error("User ID is required to generate a token")
        }

        const userIdStr = userId.toString()
        return streamClient.createToken(userIdStr)
    } catch (error) {
        console.log("Error generating stream token",error);
        
        
    }
}
