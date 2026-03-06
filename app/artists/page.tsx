export const dynamic = "force-dynamic";

import { resolvePhotoUrl } from "@/lib/blob";
import {
  getArtistsByVoicePart,
  getCORArtists,
  getConductorArtists,
} from "@/lib/db/queries/artists";
import { ArtistsClient } from "./artists-client";

const voiceSections = ["soprano", "alto", "tenor", "bass", "instrumentalist"];

function resolvePhotos<T extends { photoUrl: string | null }>(
  artists: T[],
): T[] {
  return artists.map((a) => ({
    ...a,
    photoUrl: resolvePhotoUrl(a.photoUrl),
  }));
}

export default async function ArtistsPage() {
  const [corMembers, conductors, ...voiceGroups] = await Promise.all([
    getCORArtists(),
    getConductorArtists(),
    ...voiceSections.map((vp) => getArtistsByVoicePart(vp)),
  ]);

  const voicePartMembers = Object.fromEntries(
    voiceSections.map((vp, i) => [vp, resolvePhotos(voiceGroups[i])]),
  );

  return (
    <ArtistsClient
      corMembers={resolvePhotos(corMembers)}
      conductors={resolvePhotos(conductors)}
      voicePartMembers={voicePartMembers}
    />
  );
}
