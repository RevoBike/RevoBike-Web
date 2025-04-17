export default function formatDate(dateString: string): string {
  console.log("dateString", dateString);
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour12: true,
  });
}
