import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import {
  getFavouriteHymnCount,
  getHymnCount,
  getHymnsWithoutTagsCount,
  getHymnsWithoutVersesCount,
  getRecentHymns,
  getTagDistribution,
  getWeddingHymnCount,
} from "@/lib/db/queries/hymns";
import {
  getMassProgramCount,
  getRecentPrograms,
  getUpcomingPrograms,
} from "@/lib/db/queries/mass-programs";

export async function GET() {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [
    hymnCount,
    favouriteCount,
    weddingCount,
    programCount,
    hymnsWithoutVerses,
    hymnsWithoutTags,
    recentHymns,
    tagDistribution,
    upcomingPrograms,
    recentPrograms,
  ] = await Promise.all([
    getHymnCount(),
    getFavouriteHymnCount(),
    getWeddingHymnCount(),
    getMassProgramCount(),
    getHymnsWithoutVersesCount(),
    getHymnsWithoutTagsCount(),
    getRecentHymns(8),
    getTagDistribution(),
    getUpcomingPrograms(5),
    getRecentPrograms(5),
  ]);

  return NextResponse.json({
    stats: {
      hymnCount,
      favouriteCount,
      weddingCount,
      programCount,
      hymnsWithoutVerses,
      hymnsWithoutTags,
    },
    recentHymns,
    tagDistribution,
    upcomingPrograms,
    recentPrograms,
  });
}
