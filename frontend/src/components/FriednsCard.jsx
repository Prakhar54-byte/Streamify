import { Link } from "react-router";
import { LANGUAGE_TO_FLAG } from "../constants";

const FriendCard = ({ friend, isOnline = false }) => {
  return (
    <div className="card bg-base-200/60 card-hover rounded-xl border border-base-content/5 animate-fade-in">
      <div className="card-body p-4">
        {/* User Info */}
        <div className="flex items-center gap-3 mb-3">
          <div className="relative">
            <div className="avatar">
              <div className="w-12 rounded-full ring-2 ring-primary/20">
                <img src={friend.profilePicture} alt={friend.fullName} />
              </div>
            </div>
            <span className={`absolute bottom-0 right-0 ${isOnline ? 'online-dot' : 'offline-dot'}`} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">{friend.fullName}</h3>
            <span className={`text-xs ${isOnline ? 'text-success' : 'opacity-50'}`}>
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="badge badge-secondary badge-sm gap-1">
            {getLanguageFlag(friend.nativeLanguage)}
            Native: {friend.nativeLanguage}
          </span>
          <span className="badge badge-outline badge-sm gap-1">
            {getLanguageFlag(friend.learningLanguage)}
            Learning: {friend.learningLanguage}
          </span>
        </div>

        <Link
          to={`/chat/${friend._id}`}
          className="btn btn-outline btn-sm w-full rounded-lg hover:btn-primary transition-all duration-300"
        >
          Message
        </Link>
      </div>
    </div>
  );
};
export default FriendCard;

export function getLanguageFlag(language) {
  if (!language) return null;

  const langLower = language.toLowerCase();
  const countryCode = LANGUAGE_TO_FLAG[langLower];

  if (countryCode) {
    return (
      <img
        src={`https://flagcdn.com/24x18/${countryCode}.png`}
        alt={`${langLower} flag`}
        className="h-3 mr-0.5 inline-block"
      />
    );
  }
  return null;
}
