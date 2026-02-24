import { getThirdSundays, services } from "@/data/events";
import { hasMassProgramForDate } from "@/lib/db/queries/mass-programs";
import { EventsPageClient } from "./client";

export default async function EventsPage() {
  const now = new Date();
  const upcomingDates = getThirdSundays(now.getFullYear(), 6);

  // Check which dates have mass programs
  const dateHasProgram = new Map<string, boolean>();
  for (const date of upcomingDates) {
    const slug = toDateSlug(date);
    dateHasProgram.set(slug, await hasMassProgramForDate(slug));
  }

  return (
    <EventsPageClient
      upcomingDates={upcomingDates.map((d) => d.toISOString())}
      dateHasProgram={Object.fromEntries(dateHasProgram)}
      services={services}
    />
  );
}

function toDateSlug(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
