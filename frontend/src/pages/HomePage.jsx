import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  getOutgoingFriendReqs,
  getRecommendedUsers,
  getUserFriends,
  sendFriendRequest,
  getOnlineUsers,
} from "../lib/api";
import { Link } from "react-router";
import {
  CheckCircleIcon,
  MapPinIcon,
  SearchIcon,
  UserPlusIcon,
  UsersIcon,
} from "lucide-react";

import { capitialize } from "../lib/utils";
import FriendCard, { getLanguageFlag } from "../components/FriednsCard";
import NoFriendsFound from "../components/NoFriendsFound";

const HomePage = () => {
  const queryClient = useQueryClient();
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [languageFilter, setLanguageFilter] = useState("");

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

  // Online Users Query
  const { data: onlineData } = useQuery({
    queryKey: ["onlineUsers"],
    queryFn: getOnlineUsers,
    refetchInterval: 30000, // Refresh every 30s
  });
  const onlineUserIds = new Set(onlineData?.onlineUsers || []);

  // Send Friend Request Mutation
  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] });
    },
  });

  useEffect(() => {
    const outgoingIds = new Set();
    if (outgoingFriendReqs && outgoingFriendReqs.length > 0) {
      outgoingFriendReqs.forEach((req) => {
        outgoingIds.add(req.receiver?._id || req.recipient?._id);
      });
      setOutgoingRequestsIds(outgoingIds);
    }
  }, [outgoingFriendReqs]);

  // Filter recommended users
  const filteredUsers = recommendedUsers.filter((user) => {
    const matchesSearch = !searchQuery ||
      user.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.location?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLanguage = !languageFilter ||
      user.nativeLanguage?.toLowerCase() === languageFilter.toLowerCase() ||
      user.learningLanguage?.toLowerCase() === languageFilter.toLowerCase();
    return matchesSearch && matchesLanguage;
  });

  // Get unique languages for filter
  const availableLanguages = [...new Set(
    recommendedUsers.flatMap(u => [u.nativeLanguage, u.learningLanguage].filter(Boolean))
  )];

  if (friendsError || usersError || outgoingReqsError) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center glass-card p-8 rounded-2xl animate-fade-in">
          <div className="text-4xl mb-4">😔</div>
          <p className="text-error font-medium">Failed to load data</p>
          <p className="text-sm opacity-60 mt-1">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto space-y-10 max-w-7xl">
        {/* Friends Section */}
        <section className="animate-fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Your Friends</h2>
              <p className="text-sm opacity-50 mt-1">{friends.length} connections</p>
            </div>
            <Link
              to="/notifications"
              className="btn btn-outline btn-sm rounded-lg gap-2 hover:btn-primary transition-all"
            >
              <UsersIcon className="size-4" />
              Friend Requests
            </Link>
          </div>

          {loadingFriends ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg text-primary" />
            </div>
          ) : friends.length === 0 ? (
            <NoFriendsFound />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {friends.map((friend, i) => (
                <div key={friend._id} className={`stagger-${Math.min(i + 1, 6)}`} style={{ opacity: 0, animation: `fadeIn 0.4s ease-out ${i * 0.05}s forwards` }}>
                  <FriendCard
                    friend={friend}
                    isOnline={onlineUserIds.has(friend._id)}
                  />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Recommendations Section */}
        <section className="animate-fade-in" style={{ animationDelay: '0.15s' }}>
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Meet New Learners</h2>
                <p className="text-sm opacity-50 mt-1">
                  Discover perfect language exchange partners based on your profile
                </p>
              </div>
            </div>

            {/* Search & Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 max-w-md">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 opacity-40" />
                <input
                  type="text"
                  placeholder="Search by name or location..."
                  className="input input-bordered w-full pl-10 rounded-xl input-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select
                className="select select-bordered select-sm rounded-xl"
                value={languageFilter}
                onChange={(e) => setLanguageFilter(e.target.value)}
              >
                <option value="">All Languages</option>
                {availableLanguages.map((lang) => (
                  <option key={lang} value={lang}>{capitialize(lang)}</option>
                ))}
              </select>
            </div>
          </div>

          {loadingUsers ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg text-primary" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="glass-card p-8 text-center rounded-2xl animate-fade-in">
              <div className="text-4xl mb-3">🔍</div>
              <h3 className="font-semibold text-lg mb-1">No matches found</h3>
              <p className="text-sm opacity-60">
                {searchQuery || languageFilter
                  ? "Try adjusting your search filters"
                  : "Check back later for new language partners!"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredUsers.map((user, i) => {
                const hasRequestBeenSent = outgoingRequestsIds.has(user._id);
                const isOnline = onlineUserIds.has(user._id);

                return (
                  <div
                    key={user._id}
                    className="card bg-base-200/60 card-hover rounded-xl border border-base-content/5"
                    style={{ opacity: 0, animation: `fadeIn 0.4s ease-out ${i * 0.06}s forwards` }}
                  >
                    <div className="card-body p-5 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="avatar">
                            <div className="w-14 rounded-full ring-2 ring-base-content/10">
                              <img src={user.profilePicture || user.profilePic} alt={user.fullName} />
                            </div>
                          </div>
                          <span className={`absolute bottom-0 right-0 ${isOnline ? 'online-dot' : 'offline-dot'}`} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg truncate">{user.fullName}</h3>
                          {user.location && (
                            <div className="flex items-center text-xs opacity-50 mt-0.5 gap-1">
                              <MapPinIcon className="size-3" />
                              <span className="truncate">{user.location}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Languages */}
                      <div className="flex flex-wrap gap-1.5">
                        <span className="badge badge-secondary badge-sm gap-1">
                          {getLanguageFlag(user.nativeLanguage)}
                          Native: {capitialize(user.nativeLanguage)}
                        </span>
                        <span className="badge badge-outline badge-sm gap-1">
                          {getLanguageFlag(user.learningLanguage)}
                          Learning: {capitialize(user.learningLanguage)}
                        </span>
                      </div>

                      {user.bio && (
                        <p className="text-sm opacity-60 line-clamp-2">{user.bio}</p>
                      )}

                      {/* Action button */}
                      <button
                        className={`btn w-full rounded-lg text-sm transition-all duration-300 ${
                          hasRequestBeenSent
                            ? "btn-disabled opacity-60"
                            : "btn-primary shadow-md hover:shadow-lg hover:-translate-y-0.5"
                        }`}
                        onClick={() => sendRequestMutation(user._id)}
                        disabled={hasRequestBeenSent || isPending}
                      >
                        {hasRequestBeenSent ? (
                          <>
                            <CheckCircleIcon className="size-4" />
                            Request Sent
                          </>
                        ) : (
                          <>
                            <UserPlusIcon className="size-4" />
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
    </div>
  );
};

export default HomePage;
