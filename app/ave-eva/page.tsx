import type { Metadata } from "next";
import { aveEva, formatEventDate } from "@/data/ave-eva";
import { AveEvaClient } from "./client";

const description = `${aveEva.tagline}. ${formatEventDate(aveEva.date)} at ${aveEva.venue}, ${aveEva.city}.`;

export const metadata: Metadata = {
  title: aveEva.title,
  description,
  openGraph: {
    title: `${aveEva.title} — ${aveEva.strapline}`,
    description,
    images: [
      {
        url: aveEva.poster.src,
        width: aveEva.poster.width,
        height: aveEva.poster.height,
        alt: `${aveEva.title} poster`,
      },
    ],
  },
};

export default function AveEvaPage() {
  return <AveEvaClient />;
}
