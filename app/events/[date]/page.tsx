import { notFound } from "next/navigation";
import {
  massSectionLabels,
  massSectionOrder,
  traditionLabels,
} from "@/data/repertoire";
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

  return (
    <MassProgramClient
      program={program}
      massSectionLabels={massSectionLabels}
      massSectionOrder={massSectionOrder}
      traditionLabels={traditionLabels}
    />
  );
}
