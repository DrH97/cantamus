import { redirect } from "next/navigation";
import { getSessionUserId } from "@/lib/auth";
import { DashboardClient } from "./dashboard-client";

export default async function AdminDashboard() {
  const userId = await getSessionUserId();
  if (!userId) redirect("/admin/login");

  return <DashboardClient />;
}
