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
} as const;

export function formatEventDate(dateStr: string): string {
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
