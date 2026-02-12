import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import {
  getRecommendedUsers,
  getMyFriends,
  sendFreindRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriendRequests,
  getOutgoingFriendRequests,
  getOnlineStatus,
} from "../controllers/user.controller.js";

const router = express.Router();

// Apply auth middleware to all routes
router.use(protectRoute);

router.get("/", getRecommendedUsers);
router.get("/friends", getMyFriends);
router.get("/online-status", getOnlineStatus);

router.post("/friend-request/:id", sendFreindRequest);
router.put("/friend-request/:id/accept", acceptFriendRequest);
router.delete("/friend-request/:id/reject", rejectFriendRequest);

router.get("/friend-request", getFriendRequests);
router.get("/outgoing-friend-requests", getOutgoingFriendRequests);

export default router;