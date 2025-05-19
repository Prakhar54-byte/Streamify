import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { getRecommendedUsers,getMyFriends,sendFreindRequest,acceptFriendRequest,getFriendRequests,getOutgoingFriendRequests} from "../controllers/user.controller.js"

const router = express.Router()

// apply auth middleware to all routes
router.use(protectRoute)

router.get("/",getRecommendedUsers)
router.get("/friends",getMyFriends)


router.post("/friend-request/:id",sendFreindRequest)
router.put("/freind-request/:id/accept",acceptFriendRequest)
router.put("/freind-request/:id/reject",rejectFriendRequest)

router.get("/friend-request",getFriendRequests)
router.get("/outgoing-friend-requests", getOutgoingFriendRequests)



export default router;