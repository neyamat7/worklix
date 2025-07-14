export function formatDate(dateString) {
  const date = new Date(dateString);

  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" }); // e.g., May
  const year = String(date.getFullYear()).slice(-2); // e.g., 25

  // Determine ordinal suffix
  const ordinal =
    day === 1 || day === 21 || day === 31
      ? "st"
      : day === 2 || day === 22
      ? "nd"
      : day === 3 || day === 23
      ? "rd"
      : "th";

  return `${day}${ordinal} ${month}, ${year}`;
}
