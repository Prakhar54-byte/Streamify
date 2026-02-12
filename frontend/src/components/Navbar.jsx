import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, LogOutIcon, ShipWheelIcon } from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import useLogout from "../hooks/useLogout";
import { useQuery } from "@tanstack/react-query";
import { getFriendRequests } from "../lib/api";

const Navbar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const isChatPage = location.pathname?.startsWith("/chat");

  const { logoutMutation } = useLogout();

  // Fetch friend requests to show badge count
  const { data: friendRequests } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
    enabled: !!authUser,
  });

  const pendingCount = friendRequests?.incomingRequests?.length || 0;

  return (
    <nav className="glass-navbar border-b border-base-content/5 sticky top-0 z-30 h-16 flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-end w-full">
          {/* Logo — only on Chat page */}
          {isChatPage && (
            <div className="pl-5">
              <Link to="/" className="flex items-center gap-2.5 group">
                <div className="p-1.5 rounded-lg gradient-primary shadow-md group-hover:shadow-lg transition-shadow">
                  <ShipWheelIcon className="size-6 text-primary-content" />
                </div>
                <span className="text-2xl font-bold tracking-tight gradient-text">
                  Streamify
                </span>
              </Link>
            </div>
          )}

          <div className="flex items-center gap-2 sm:gap-3 ml-auto">
            {/* Notifications */}
            <Link to="/notifications">
              <button className="btn btn-ghost btn-circle relative hover:bg-base-content/5 transition-colors">
                <BellIcon className="h-5 w-5 text-base-content/70" />
                {pendingCount > 0 && (
                  <span className="notification-badge">{pendingCount}</span>
                )}
              </button>
            </Link>

            {/* Theme Selector */}
            <ThemeSelector />

            {/* User Avatar */}
            <div className="avatar">
              <div className="w-9 rounded-full ring-2 ring-primary/20 hover:ring-primary/40 transition-all">
                <img src={authUser?.profilePicture} alt="User Avatar" />
              </div>
            </div>

            {/* Logout */}
            <button
              className="btn btn-ghost btn-circle hover:bg-error/10 hover:text-error transition-colors"
              onClick={logoutMutation}
              title="Logout"
            >
              <LogOutIcon className="h-5 w-5 text-base-content/70" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;