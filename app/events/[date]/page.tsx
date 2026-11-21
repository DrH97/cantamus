import { notFound } from "next/navigation";
import { traditionLabels } from "@/data/repertoire";
import { resolveScoreUrl } from "@/lib/blob";
import { getMassProgramWithSongs } from "@/lib/db/queries/mass-programs";
import { getMassSections } from "@/lib/db/queries/mass-sections";
import { MassProgramClient } from "./client";

export default async function MassProgramPage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = await params;
  const [program, sections] = await Promise.all([
    getMassProgramWithSongs(date),
    getMassSections(),
  ]);

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
      massSectionLabels={Object.fromEntries(
        sections.map((s) => [s.slug, s.label]),
      )}
      massSectionOrder={sections.map((s) => s.slug)}
      traditionLabels={traditionLabels}
    />
  );
}
