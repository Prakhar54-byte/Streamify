import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  getOutgoingFriendReqs,
  getRecommendedUsers,
  getUserFriends,
  sendFriendRequest,
} from "../lib/api";
import { Link } from "react-router-dom";
import {
  CheckCircleIcon,
  MapPinIcon,
  UserPlusIcon,
  UsersIcon,
} from "lucide-react";

import { capitialize } from "../lib/utils";
import FriendCard, { getLanguageFlag } from "../components/FriednsCard";
import NoFriendsFound from "../components/NoFriendsFound";

const HomePage = () => {
  const queryClient = useQueryClient();
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());

  // Friends Query
  const {
    data: data1,
    isLoading: loadingFriends,
    isError: friendsError,
  } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });
  const friends = data1?.user ?? [];

  // Recommended Users Query
  const {
    data,
    isLoading: loadingUsers,
    isError: usersError,
  } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers,
  });
  const recommendedUsers = data?.users ?? [];

  // Outgoing Friend Requests Query
  const {
    data: outgoingFriendReqs,
    isError: outgoingReqsError,
  } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
  });

  // Send Friend Request Mutation
  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] });
    },
  });

  // Update outgoing request IDs when data changes
  useEffect(() => {
    if (outgoingFriendReqs && Array.isArray(outgoingFriendReqs)) {
      const outgoingIds = new Set();
      outgoingFriendReqs.forEach((req) => {
        if (req?.recipient?._id) outgoingIds.add(req.recipient._id);
      });
      setOutgoingRequestsIds(outgoingIds);
    }
  }, [outgoingFriendReqs]);

  // Top-level error handling
  if (friendsError || usersError || outgoingReqsError) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center text-red-500">
          Failed to load data. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-10 max-w-screen-xl mx-auto">
      {/* Friends Section */}
      <section className="mb-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Your Friends</h2>
          <Link to="/notifications" className="btn btn-outline btn-sm">
            <UsersIcon className="mr-2 size-4" />
            Friend Requests
          </Link>
        </div>

        {loadingFriends ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : friends.length === 0 ? (
          <NoFriendsFound />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {friends.map((friend) => (
              <FriendCard key={friend._id} friend={friend} />
            ))}
          </div>
        )}
      </section>

      {/* Recommendations Section */}
      <section>
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Meet New Learners</h2>
              <p className="opacity-70 text-sm mt-1">
                Discover perfect language exchange partners based on your profile
              </p>
            </div>
          </div>
        </div>

        {loadingUsers ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : recommendedUsers.length === 0 ? (
          <div className="card bg-base-200 p-6 text-center">
            <h3 className="font-semibold text-lg mb-2">No recommendations available</h3>
            <p className="text-base-content opacity-70">
              Check back later for new language partners!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedUsers.map((user) => {
              const hasRequestBeenSent = outgoingRequestsIds.has(user._id);

              return (
                <div
                  key={user._id}
                  className="card bg-base-200 hover:shadow-lg transition-all duration-300 rounded-xl"
                >
                  <div className="card-body p-5 space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="avatar size-16 rounded-full shrink-0">
                        <img
                          src={user?.profilePicture || "/default-avatar.png"}
                          alt={user?.fullName || "User"}
                          className="rounded-full"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{user?.fullName || "Unknown"}</h3>
                        {user?.location && (
                          <div className="flex items-center text-xs opacity-70 mt-1">
                            <MapPinIcon className="size-3 mr-1" />
                            {user.location}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <span className="badge badge-secondary">
                        {getLanguageFlag(user?.nativeLanguage)}
                        Native: {capitialize(user?.nativeLanguage || "")}
                      </span>
                      <span className="badge badge-outline">
                        {getLanguageFlag(user?.learningLanguage)}
                        Learning: {capitialize(user?.learningLanguage || "")}
                      </span>
                    </div>

                    {user?.bio && (
                      <p className="text-sm opacity-70 line-clamp-3">{user.bio}</p>
                    )}

                    <button
                      className={`btn w-full ${
                        hasRequestBeenSent ? "btn-disabled" : "btn-primary"
                      }`}
                      onClick={() => sendRequestMutation(user._id)}
                      disabled={hasRequestBeenSent || isPending}
                    >
                      {hasRequestBeenSent ? (
                        <>
                          <CheckCircleIcon className="size-4 mr-2" />
                          Request Sent
                        </>
                      ) : (
                        <>
                          <UserPlusIcon className="size-4 mr-2" />
                          Send Friend Request
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
