// src/utils/time.js

export default function getTimeAgo(timestamp) {
  if (!timestamp) return "";

  const now = Date.now();
  const diff = now - timestamp;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  // Very recent
  if (seconds < 10) {
    return "Just now";
  }

  if (seconds < 60) {
    return `${seconds} sec ago`;
  }

  // Minutes
  if (minutes < 60) {
    return `${minutes} min ago`;
  }

  // Hours
  if (hours < 24) {
    return `${hours} hr${hours > 1 ? "s" : ""} ago`;
  }

  // Yesterday
  if (days === 1) {
    return "Yesterday";
  }

  // Older than yesterday → show date
  return new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
