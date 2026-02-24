import {
  massSectionLabels,
  massSectionOrder,
  traditionLabels,
} from "@/data/repertoire";
import { getFavouriteHymns } from "@/lib/db/queries/hymns";
import { MusicPageClient } from "./client";

export default async function MusicPage() {
  const hymns = await getFavouriteHymns();

  // Group hymns by their category (mass section) — for now we show all favourites
  // The public page still organises by mass section tabs
  // Since DB hymns don't have a single massSection, we pass them flat
  // and let the client render them as a flat list or grouped by category

  return (
    <MusicPageClient
      hymns={hymns}
      massSectionLabels={massSectionLabels}
      massSectionOrder={massSectionOrder}
      traditionLabels={traditionLabels}
    />
  );
}
