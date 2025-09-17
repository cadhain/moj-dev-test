export function formatDateTime(isoString: string): string {
  const date = new Date(isoString);

  const dueDate = date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long", // long month version
    year: "numeric",
  });

  const dueTime = date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, // 24-hour clock
  });

  return `${dueDate} at ${dueTime}`;
}

/**
 * Build an ISO datetime string from separate date and time inputs.
 * Pads single-digit inputs with leading zeros to ensure valid formatting.
 */
export function buildIsoDateTime(
  year: string,
  month: string,
  day: string,
  hour: string,
  minute: string
): string {
  const date = new Date(
    `${year.padStart(4, "0")}-${month.padStart(2, "0")}-${day.padStart(
      2,
      "0"
    )}T${hour.padStart(2, "0")}:${minute.padStart(2, "0")}:00`
  );
  return date.toISOString();
}
