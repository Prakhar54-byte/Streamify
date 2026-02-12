import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { acceptFriendRequest, rejectFriendRequest, getFriendRequests } from "../lib/api.js";
import { BellIcon, ClockIcon, MessageSquareIcon, UserCheckIcon, XCircleIcon } from "lucide-react";
import NoNotificationsFound from "../components/NoNotificationFound.jsx";

const NotificationsPage = () => {
  const queryClient = useQueryClient();

  const { data: friendRequests, isLoading } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
  });

  const { mutate: acceptRequestMutation, isPending: acceptPending } = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
  });

  const { mutate: rejectRequestMutation, isPending: rejectPending } = useMutation({
    mutationFn: rejectFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
    },
  });

  const incomingRequests = friendRequests?.incomingRequests || [];
  const acceptedRequests = friendRequests?.acceptedRequest || [];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-4xl space-y-8">
        <div className="animate-fade-in">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-sm opacity-50 mt-1">
            Manage your friend requests and connections
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : (
          <>
            {/* Incoming Requests */}
            {incomingRequests.length > 0 && (
              <section className="space-y-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <UserCheckIcon className="h-5 w-5 text-primary" />
                  Friend Requests
                  <span className="badge badge-primary badge-sm ml-1">{incomingRequests.length}</span>
                </h2>

                <div className="space-y-3">
                  {incomingRequests.map((request, i) => (
                    <div
                      key={request._id}
                      className="card bg-base-200/60 border border-base-content/5 card-hover rounded-xl"
                      style={{ opacity: 0, animation: `fadeIn 0.4s ease-out ${i * 0.08}s forwards` }}
                    >
                      <div className="card-body p-4">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="avatar">
                              <div className="w-12 h-12 rounded-full ring-2 ring-primary/20">
                                <img
                                  src={request.sender.profilePicture || request.sender.profilePic}
                                  alt={request.sender.fullName}
                                />
                              </div>
                            </div>
                            <div className="min-w-0">
                              <h3 className="font-semibold truncate">{request.sender.fullName}</h3>
                              <div className="flex flex-wrap gap-1.5 mt-1">
                                <span className="badge badge-secondary badge-xs">
                                  Native: {request.sender.nativeLanguage}
                                </span>
                                <span className="badge badge-outline badge-xs">
                                  Learning: {request.sender.learningLanguage}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2 shrink-0">
                            <button
                              className="btn btn-primary btn-sm rounded-lg shadow-sm hover:shadow-md transition-all"
                              onClick={() => acceptRequestMutation(request._id)}
                              disabled={acceptPending || rejectPending}
                            >
                              Accept
                            </button>
                            <button
                              className="btn btn-ghost btn-sm rounded-lg text-error hover:bg-error/10 transition-all"
                              onClick={() => rejectRequestMutation(request._id)}
                              disabled={acceptPending || rejectPending}
                            >
                              <XCircleIcon className="size-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Accepted Requests */}
            {acceptedRequests.length > 0 && (
              <section className="space-y-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <BellIcon className="h-5 w-5 text-success" />
                  New Connections
                </h2>

                <div className="space-y-3">
                  {acceptedRequests.map((notification, i) => (
                    <div
                      key={notification._id}
                      className="card bg-base-200/60 border border-base-content/5 rounded-xl"
                      style={{ opacity: 0, animation: `fadeIn 0.4s ease-out ${i * 0.08}s forwards` }}
                    >
                      <div className="card-body p-4">
                        <div className="flex items-start gap-3">
                          <div className="avatar mt-0.5">
                            <div className="w-10 rounded-full ring-2 ring-success/20">
                              <img
                                src={notification.recipient.profilePicture || notification.recipient.profilePic}
                                alt={notification.recipient.fullName}
                              />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold">{notification.recipient.fullName}</h3>
                            <p className="text-sm opacity-60 mt-0.5">
                              {notification.recipient.fullName} accepted your friend request
                            </p>
                            <p className="text-xs flex items-center opacity-40 mt-1 gap-1">
                              <ClockIcon className="h-3 w-3" />
                              Recently
                            </p>
                          </div>
                          <div className="badge badge-success gap-1 shrink-0">
                            <MessageSquareIcon className="h-3 w-3" />
                            New Friend
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {incomingRequests.length === 0 && acceptedRequests.length === 0 && (
              <NoNotificationsFound />
            )}
          </>
        )}
      </div>
    </div>
  );
};
export default NotificationsPage;
