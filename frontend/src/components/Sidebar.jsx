import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, HomeIcon, ShipWheelIcon, UsersIcon } from "lucide-react";

const Sidebar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { path: "/", icon: HomeIcon, label: "Home" },
    { path: "/friends", icon: UsersIcon, label: "Friends" },
    { path: "/notifications", icon: BellIcon, label: "Notifications" },
  ];

  return (
    <aside className="w-64 glass-sidebar border-r border-base-content/5 hidden lg:flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="p-5 border-b border-base-content/5">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="p-1.5 rounded-lg gradient-primary shadow-md group-hover:shadow-lg transition-shadow">
            <ShipWheelIcon className="size-7 text-primary-content" />
          </div>
          <span className="text-2xl font-bold tracking-tight gradient-text">
            Streamify
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = currentPath === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                transition-all duration-200
                ${isActive
                  ? "bg-primary/10 text-primary shadow-sm"
                  : "text-base-content/70 hover:bg-base-content/5 hover:text-base-content"
                }
              `}
            >
              <item.icon className={`size-5 ${isActive ? "text-primary" : ""}`} />
              <span>{item.label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse-dot" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Profile Section */}
      <div className="p-4 border-t border-base-content/5">
        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-base-content/5 transition-colors">
          <div className="relative">
            <div className="avatar">
              <div className="w-10 rounded-full ring-2 ring-primary/20">
                <img src={authUser?.profilePicture} alt="User Avatar" />
              </div>
            </div>
            <span className="absolute bottom-0 right-0 online-dot" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate">{authUser?.fullName}</p>
            <p className="text-xs text-success flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-success inline-block" />
              Online
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
export default Sidebar;
