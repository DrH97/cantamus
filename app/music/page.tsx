import { traditionLabels } from "@/data/repertoire";
import { getFavouriteHymns } from "@/lib/db/queries/hymns";
import { MusicPageClient } from "./client";

export default async function MusicPage() {
  const hymns = await getFavouriteHymns();

  return <MusicPageClient hymns={hymns} traditionLabels={traditionLabels} />;
}
