export const dynamic = "force-dynamic";

import {
  getArtistsByVoicePart,
  getCORArtists,
  getConductorArtists,
} from "@/lib/db/queries/artists";
import { ArtistsClient } from "./artists-client";

const voiceSections = ["soprano", "alto", "tenor", "bass", "instrumentalist"];

export default async function ArtistsPage() {
  const [corMembers, conductors, ...voiceGroups] = await Promise.all([
    getCORArtists(),
    getConductorArtists(),
    ...voiceSections.map((vp) => getArtistsByVoicePart(vp)),
  ]);

  const voicePartMembers = Object.fromEntries(
    voiceSections.map((vp, i) => [vp, voiceGroups[i]]),
  );

  return (
    <ArtistsClient
      corMembers={corMembers}
      conductors={conductors}
      voicePartMembers={voicePartMembers}
    />
  );
}
