export default function Conversation({ username, img_url, date_created }) {
  return (
    <div className="flex items-center p-3 border-b cursor-pointer hover:bg-secondary rounded-lg">
      {/* Profile Picture */}
      <img
        src={img_url} // Placeholder image
        alt="User Avatar"
        className="w-10 h-10 rounded-full mr-3"
      />

      {/* Chat Info */}
      <div className="flex-1">
        <h3 className="font-semibold">{username}</h3>
        <p className="text-sm text-secondary-foreground truncate">
          Last Message
        </p>
      </div>

      {/* Timestamp */}
      <span className="text-xs text-secondary-foreground">{date_created}</span>
    </div>
  );
}
