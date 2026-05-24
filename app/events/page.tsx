import { getThirdSundays, services } from "@/data/events";
import { getMassProgramsFromDate } from "@/lib/db/queries/mass-programs";
import { EventsPageClient } from "./client";

export const revalidate = 3600;

const GRACE_PERIOD_DAYS = 7;
const DEFAULT_TITLE = "Young Professionals' Mass";

export default async function EventsPage() {
  const now = new Date();
  const cutoff = new Date(now);
  cutoff.setDate(cutoff.getDate() - GRACE_PERIOD_DAYS);
  const cutoffSlug = toDateSlug(cutoff);

  const formulaDates = getThirdSundays(now.getFullYear(), 7).filter(
    (d) => toDateSlug(d) >= cutoffSlug,
  );
  const dbPrograms = await getMassProgramsFromDate(cutoffSlug);

  const eventMap = new Map<
    string,
    { slug: string; title: string; hasProgram: boolean }
  >();

  for (const d of formulaDates) {
    const slug = toDateSlug(d);
    eventMap.set(slug, { slug, title: DEFAULT_TITLE, hasProgram: false });
  }
  for (const p of dbPrograms) {
    const existing = eventMap.get(p.date);
    if (existing) {
      eventMap.set(p.date, {
        slug: p.date,
        title: p.title ?? existing.title,
        hasProgram: true,
      });
    } else {
      eventMap.set(p.date, {
        slug: p.date,
        title: p.title ?? DEFAULT_TITLE,
        hasProgram: true,
      });
    }
  }

  const events = [...eventMap.values()].sort((a, b) =>
    a.slug.localeCompare(b.slug),
  );

  return <EventsPageClient events={events} services={services} />;
}

function toDateSlug(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
