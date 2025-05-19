import FriendRequest from "../models/FriendRequest.js";
import User from "../models/User.js";

export async function getRecommendedUsers(req,res) {
    try {
        const currentUserId = req.user.id;
        const currentUser = req.user

        const recommendedeUser = await User.find({
            $and:[
                {_id:{$ne:currentUserId}}, // exclude current user
                {$id:{$nin:currentUser.friends}}, // exculde current users friends
                {isOnboarded:true},
            ]

        })
        res.status(200).json(recommendedeUser)
    } catch (error) {
        console.log("Error in getRecommendedUsers controller",error.message);
        return res.status(500).json({
            message:"Internale Server Error"
        })
        
        
    }
}


export async function getMyFriends(req,res){
    try {
        const user = await User.findById(req.user.id)
        .select("friends")
        .populate("friends","fullName profilePicture nativeLanguage learnLanguage");


        res.status(200).json(user.friends)
    } catch (error) {
          console.log("Error in getMyFriends  controller",error.message);
        return res.status(500).json({
            message:"Internale Server Error"
        })
        
    }
}


export async function sendFreindRequest(req,res){
    try {
        const myId=req.user.id
        const { id:recipientId} =req.params 

        // prevent sendinf request to ourself
        if(myId === recipientId){
            return res.status(400).json({
                message:"You cannot send request to yourself"
            })
        }

        const recipient = await User.findById(recipientId)
        // check if the recipient exists
        if(!recipient){
            return res.status(404).json({
                message:"Recepient not found"
            })
        }
        // check if the recipient is already a friend
        if(recipient.friends.includes(myId)){
            return res.status(400).json({
                message:"You are already friends"
            })
        }

        const existingRequest =  await FriendRequest.findOne({
            $or:[
                {sender:myId,recipient:recipientId},
                {sender:recipientId,recipient:myId}
            ]
        })
        if(existingRequest){
            return res.status(400).json({
                message:"Friend request already sent"
            })
        } 

        const friendRequest = await FriendRequest.create({
            sender:myId,
            recipient:recipientId
        })

        res.status(201).json({
            message:"Friend request sent",
            friendRequest
        })


    } catch (error) {
        console.log("Error in sendFreindRequest controller",error.message);
        return res.status(500).json({
            message:"Internale Server Error"
        })
        
    }
}


export async function acceptFriendRequest(req,res){
    try {
        const {id:requestId} = req.params

        const friendRequest = await FriendRequest.findById(requestId)

        if(!friendRequest){
            return res.status(404).json({
                message:"Friend request not found"
            })
        }
// check if the request is already accepted
        if(!friendRequest.recipient.equals(req.user.id)){
            return res.status(403).json({
                message:"You are not authorized to accept this request"
            })
        }
        
        friendRequest.status="accepted"
        await friendRequest.save()

        // add each user to the other's friends array
        // $addToSet will add the user to the array if it doesn't already exist

        await User.findByIdAndUpdate(friendRequest.sender,{
            $addToSet:{friends:friendRequest.recipient}
        })

        await User.findByIdAndUpdate(friendRequest.recipient,{
            $addToSet:{friends:friendRequest.sender}
        })

        res.status(200).json({
            message:"Friend request accepted"
        })
    } catch (error) {
        console.log("Error in acceptFriendRequest controller",error.message);
        return res.status(500).json({
            message:"Internale Server Error"
        })
        
    }
}

export async function getFriendRequests(req,res){
    try {
        const incomingRequests = await FriendRequest.find({
            recipient:req.user.id,
            status:"pending"
        }).populate("sender","fullName profilePicture nativeLanguage learnLanguage")


        const acceptedRequest = await FriendRequest.find({
            sender:req.user.id,
            status:"accepted"
        }).populate("recipient","fullName profilePicture nativeLanguage learnLanguage")

        res.status(200).json({
            incomingRequests,
            acceptedRequest
        })
    } catch (error) {
        console.log("Error in getFriendRequests controller",error.message); 
        res.status(500).json({
            message:"Internale Server Error"
        })
    }
}

export async function getOutgoingFriendRequests(req,res){
    try {
        const outgoingRequest = await FriendRequest.find({
            sender:req.user.id,
            status:"pending"
        }).populate("recipient","fullName profilePicture nativeLanguage learnLanguage")
    } catch (error) {
        console.log("Error in getOutgoingFriendRequests controller",error.message); 
        res.status(500).json({
            message:"Internale Server Error"
        })
        
    }
}

// TODO : add reject friend request controller