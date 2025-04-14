export function formatDate(date: Date | string): string {
  const d = new Date(date)
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d)
} 