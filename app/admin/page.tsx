import { redirect } from "next/navigation";
import { getSessionUserId } from "@/lib/auth";
import { getFavouriteHymnCount, getHymnCount } from "@/lib/db/queries/hymns";
import { getMassProgramCount } from "@/lib/db/queries/mass-programs";

export default async function AdminDashboard() {
  const userId = await getSessionUserId();
  if (!userId) redirect("/admin/login");

  const [hymnCount, favouriteCount, programCount] = await Promise.all([
    getHymnCount(),
    getFavouriteHymnCount(),
    getMassProgramCount(),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-text mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total Hymns" value={hymnCount} />
        <StatCard label="Favourites (Public)" value={favouriteCount} />
        <StatCard label="Mass Programs" value={programCount} />
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-surface border border-border rounded-lg p-5">
      <p className="text-sm text-text-muted">{label}</p>
      <p className="text-3xl font-bold text-text mt-1">{value}</p>
    </div>
  );
}
