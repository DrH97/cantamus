export interface Service {
  id: string;
  title: string;
  description: string;
  link?: { href: string; label: string };
}

export function getThirdSundays(year: number, monthCount: number): Date[] {
  const dates: Date[] = [];
  const now = new Date();
  let month = now.getMonth();
  let y = year;

  for (let i = 0; i < monthCount; i++) {
    // First day of the month
    const first = new Date(y, month, 1);
    // Day of week: 0 = Sunday
    const firstDay = first.getDay();
    // First Sunday: if firstDay is 0, it's the 1st; otherwise 8 - firstDay
    const firstSunday = firstDay === 0 ? 1 : 8 - firstDay;
    // Third Sunday = first Sunday + 14
    const thirdSunday = new Date(y, month, firstSunday + 14);
    dates.push(thirdSunday);

    month++;
    if (month > 11) {
      month = 0;
      y++;
    }
  }

  return dates;
}

export const services: Service[] = [
  {
    id: "weddings",
    title: "Weddings",
    description:
      "Make your special day truly memorable with sacred music. We offer a curated selection of Gregorian, Classical, and African pieces for your wedding liturgy.",
    link: { href: "/music", label: "View Repertoire" },
  },
  {
    id: "concerts",
    title: "Concerts",
    description:
      "Experience the beauty of sacred music in concert. We perform a rich programme spanning Gregorian chant, Classical polyphony, and African choral traditions.",
  },
];
