import { notFound } from "next/navigation";
import {
  massSectionLabels,
  massSectionOrder,
  traditionLabels,
} from "@/data/repertoire";
import { resolveScoreUrl } from "@/lib/blob";
import { getMassProgramWithSongs } from "@/lib/db/queries/mass-programs";
import { MassProgramClient } from "./client";

export default async function MassProgramPage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = await params;
  const program = await getMassProgramWithSongs(date);

  if (!program) {
    notFound();
  }

  const songsWithResolvedScores = program.songs.map((song) => ({
    ...song,
    hymnScoreUrl: resolveScoreUrl(song.hymnScoreUrl),
  }));

  return (
    <MassProgramClient
      program={{ ...program, songs: songsWithResolvedScores }}
      massSectionLabels={massSectionLabels}
      massSectionOrder={massSectionOrder}
      traditionLabels={traditionLabels}
    />
  );
}
