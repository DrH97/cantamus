export interface TicketTier {
  name: string;
  price: number;
  currency: string;
  note: string;
  featured?: boolean;
}

export const aveEva = {
  title: "Ave Eva",
  /** Strapline as it appears on the poster */
  strapline: "From Fall. To Favour.",
  tagline:
    "A musical written from the point of view of the Blessed Virgin Mary",
  billing: "A Cantamus Musical",
  presenter: "The Young Catholic Professionals of Nairobi",
  poster: {
    src: "/images/ave-eva-poster.jpg",
    width: 1170,
    height: 1648,
  },
  /** ISO date of the performance */
  date: "2026-09-13",
  doorsOpen: "3:00 pm",
  venue: "Strathmore University Auditorium",
  city: "Strathmore, Nairobi",
  audience: "Suitable for the whole family",
  ticketsUrl: "https://www.tikohub.com/events/ave-eva",
  archetypes: [
    {
      name: "Virgin",
      description:
        "Mary at the threshold — asked to trust a promise she cannot yet see.",
    },
    {
      name: "Mother",
      description:
        "Mary bearing and raising the Word, and bearing the cost of that fiat.",
    },
    {
      name: "Warrior Queen",
      description:
        "Mary crowned — standing against the serpent on behalf of her children.",
    },
  ],
  tickets: [
    {
      name: "Children",
      price: 1000,
      currency: "Ksh",
      note: "For the little ones in the family",
    },
    {
      name: "Standard",
      price: 2000,
      currency: "Ksh",
      note: "General admission seating",
      featured: true,
    },
    {
      name: "VIP",
      price: 5000,
      currency: "Ksh",
      note: "Premium seating closest to the stage",
    },
  ] satisfies TicketTier[],
} as const;

export function formatEventDate(dateStr: string): string {
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Local calendar day as YYYY-MM-DD, comparable with the ISO event date. */
function localDateKey(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

/**
 * True once the performance day is behind us. The day itself still counts as
 * upcoming, so a callout stays put for anyone checking details on the way.
 *
 * Compares local calendar days rather than timestamps, so it flips at local
 * midnight for the viewer and never drifts by a timezone.
 */
export function isAveEvaOver(now: Date = new Date()): boolean {
  return localDateKey(now) > aveEva.date;
}
