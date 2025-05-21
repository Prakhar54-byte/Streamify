import { axiosInstance } from "./axios.js";

export const signup = async (signupData)=>{
    const res = await axiosInstance.post("/auth/signup",signupData)
    return res.data
}

export const getAuthUser = async ()=>{
     try {
      const res = await axiosInstance.get("/auth/me",)
       return res.data
     
     } catch (error) {
        console.log("Error in getAuthUser",error);
        return null
      
     }
}


export const  completeOnboarding= async (onboardingData)=>{
    const res = await axiosInstance.post("/auth/onboarding",onboardingData)
    return res.data
}

export const login = async (loginData)=>{
    const res = await axiosInstance.post("/auth/login",loginData)
    return res.data
}

export const logout = async () => {
  const response = await axiosInstance.post("/auth/logout");
  return response.data;
};



export const getUserFriends = async ()=>{
    const res = await axiosInstance.get("/users/friends")
    return res.data
}
export async function getRecommendedUsers() {
  const response = await axiosInstance.get("/users");
  return response.data;
}

export async function getOutgoingFriendReqs() {
  const response = await axiosInstance.get("/users/outgoing-friend-requests");
  return response.data;
}

export async function sendFriendRequest(userId) {
  const response = await axiosInstance.get(`/users/friend-request/${userId}`);
  return response.data;
}

export async function getFriendRequests() {
  const response = await axiosInstance.get("/users/friend-request");
  return response.data;
}

export async function acceptFriendRequest(requestId) {
  const response = await axiosInstance.put(`/users/friend-request/${requestId}/accept`);
  return response.data;
}

export async function getStreamToken() {
  const response = await axiosInstance.get("/chats/token");
  return response.data;
}