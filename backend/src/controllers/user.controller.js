import FriendRequest from "../models/FriendRequest.js";
import User from "../models/User.js";
import { publishEvent } from "../lib/redis.js";
import { cacheGet, cacheSet, cacheDelete } from "../lib/redis.js";
import { getOnlineUsers } from "../lib/presence.js";

export async function getRecommendedUsers(req, res) {
  try {
    const currentUserId = req.user.id;
    const currentUser = req.user;

    // Try cache first
    const cacheKey = `recommended_users:${currentUserId}`;
    const cached = await cacheGet(cacheKey);
    if (cached) {
      return res.status(200).json({
        message: "Recommended users (cached)",
        users: cached,
      });
    }

    const recommendedUsers = await User.find({
      $and: [
        { _id: { $ne: currentUserId } },
        { _id: { $nin: currentUser.friends } },
        { isOnboarded: true },
      ],
    }).select("-password")
      .limit(50)
      .lean();

    // Cache for 60 seconds
    await cacheSet(cacheKey, recommendedUsers, 60);

    res.status(200).json({
      message: "Recommended users",
      users: recommendedUsers,
    });
  } catch (error) {
    console.log("Error in getRecommendedUsers controller", error.message);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

export async function getMyFriends(req, res) {
  try {
    const user = await User.findById(req.user.id)
      .select("friends")
      .populate("friends", "fullName profilePicture nativeLanguage learningLanguage");

    res.status(200).json({
      user: user.friends,
      message: "My friends",
    });
  } catch (error) {
    console.log("Error in getMyFriends controller", error.message);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

export async function sendFreindRequest(req, res) {
  try {
    const myId = req.user.id;
    const { id: recipientId } = req.params;

    if (myId === recipientId) {
      return res.status(400).json({
        message: "You cannot send request to yourself",
      });
    }

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({
        message: "Recipient not found",
      });
    }

    if (recipient.friends.includes(myId)) {
      return res.status(400).json({
        message: "You are already friends",
      });
    }

    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: myId, recipient: recipientId },
        { sender: recipientId, recipient: myId },
      ],
    });
    if (existingRequest) {
      return res.status(400).json({
        message: "Friend request already sent",
      });
    }

    const friendRequest = await FriendRequest.create({
      sender: myId,
      recipient: recipientId,
    });

    // Publish Redis event for real-time notification
    await publishEvent("friend_request_events", {
      type: "new_request",
      targetUserId: recipientId,
      senderId: myId,
      senderName: req.user.fullName,
      requestId: friendRequest._id,
    });

    res.status(201).json({
      message: "Friend request sent",
      friendRequest,
    });
  } catch (error) {
    console.log("Error in sendFreindRequest controller", error.message);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

export async function acceptFriendRequest(req, res) {
  try {
    const { id: requestId } = req.params;
    const friendRequest = await FriendRequest.findById(requestId);

    if (!friendRequest) {
      return res.status(404).json({
        message: "Friend request not found",
      });
    }

    if (!friendRequest.recipient.equals(req.user.id)) {
      return res.status(403).json({
        message: "You are not authorized to accept this request",
      });
    }

    friendRequest.status = "accepted";
    await friendRequest.save();

    await User.findByIdAndUpdate(friendRequest.sender, {
      $addToSet: { friends: friendRequest.recipient },
    });

    await User.findByIdAndUpdate(friendRequest.recipient, {
      $addToSet: { friends: friendRequest.sender },
    });

    // Invalidate recommended users cache for both users
    await cacheDelete(`recommended_users:${friendRequest.sender}`);
    await cacheDelete(`recommended_users:${friendRequest.recipient}`);

    // Publish Redis event
    await publishEvent("friend_request_events", {
      type: "request_accepted",
      targetUserId: friendRequest.sender.toString(),
      acceptedBy: req.user.fullName,
      requestId: friendRequest._id,
    });

    res.status(200).json({
      message: "Friend request accepted",
    });
  } catch (error) {
    console.log("Error in acceptFriendRequest controller", error.message);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

export async function rejectFriendRequest(req, res) {
  try {
    const { id: requestId } = req.params;
    const friendRequest = await FriendRequest.findById(requestId);

    if (!friendRequest) {
      return res.status(404).json({
        message: "Friend request not found",
      });
    }

    if (!friendRequest.recipient.equals(req.user.id)) {
      return res.status(403).json({
        message: "You are not authorized to reject this request",
      });
    }

    await FriendRequest.findByIdAndDelete(requestId);

    // Publish Redis event
    await publishEvent("friend_request_events", {
      type: "request_rejected",
      targetUserId: friendRequest.sender.toString(),
      rejectedBy: req.user.fullName,
      requestId: friendRequest._id,
    });

    res.status(200).json({
      message: "Friend request rejected",
    });
  } catch (error) {
    console.log("Error in rejectFriendRequest controller", error.message);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

export async function getFriendRequests(req, res) {
  try {
    const incomingRequests = await FriendRequest.find({
      recipient: req.user.id,
      status: "pending",
    }).populate("sender", "fullName profilePicture nativeLanguage learningLanguage");

    const acceptedRequest = await FriendRequest.find({
      sender: req.user.id,
      status: "accepted",
    }).populate("recipient", "fullName profilePicture nativeLanguage learningLanguage");

    res.status(200).json({
      message: "Friend requests",
      incomingRequests,
      acceptedRequest,
    });
  } catch (error) {
    console.log("Error in getFriendRequests controller", error.message);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

export async function getOutgoingFriendRequests(req, res) {
  try {
    const outgoingRequest = await FriendRequest.find({
      sender: req.user.id,
      status: "pending",
    }).populate("recipient", "fullName profilePicture nativeLanguage learningLanguage");
    res.status(200).json({
      message: "Outgoing friend requests",
      outgoingRequest,
    });
  } catch (error) {
    console.log("Error in getOutgoingFriendRequests controller", error.message);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

export async function getOnlineStatus(req, res) {
  try {
    const onlineUserIds = await getOnlineUsers();
    res.status(200).json({
      onlineUsers: onlineUserIds,
    });
  } catch (error) {
    console.log("Error in getOnlineStatus controller", error.message);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
}