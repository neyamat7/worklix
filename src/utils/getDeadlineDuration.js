export function getDeadlineDuration(completionDateString) {
  const now = new Date();
  const completionDate = new Date(completionDateString);

  // Compute difference in milliseconds
  const diffMs = completionDate - now;

  if (diffMs <= 0) {
    return "Expired";
  }

  // Convert ms to days
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 7) {
    return `${diffDays} day${diffDays > 1 ? "s" : ""}`;
  } else if (diffDays < 30) {
    const weeks = Math.ceil(diffDays / 7);
    return `${weeks} week${weeks > 1 ? "s" : ""}`;
  } else {
    const months = Math.ceil(diffDays / 30);
    return `${months} month${months > 1 ? "s" : ""}`;
  }
}
