import type { Metadata } from "next";
import Link from "next/link";
import { AdminNavLinks } from "@/components/admin/nav-links";
import { ToastProvider } from "@/components/admin/toast";
import { getSessionUserId } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Admin",
};

async function isAuthenticated() {
  try {
    const userId = await getSessionUserId();
    return !!userId;
  } catch {
    return false;
  }
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authed = await isAuthenticated();

  return (
    <div className="min-h-screen bg-background">
      {authed ? (
        <ToastProvider>
          <div className="flex min-h-screen">
            <aside className="w-56 bg-surface border-r border-border flex flex-col flex-shrink-0">
              <div className="p-4 border-b border-border">
                <Link
                  href="/admin"
                  className="text-lg font-bold text-primary tracking-wide"
                >
                  Cantamus Admin
                </Link>
              </div>
              <AdminNavLinks />
              <div className="p-3 border-t border-border space-y-1">
                <Link
                  href="/"
                  className="block px-3 py-2 text-sm text-text-muted hover:text-text hover:bg-surface-elevated rounded transition-colors"
                >
                  View Site
                </Link>
                <form action="/api/auth/logout" method="POST">
                  <button
                    type="submit"
                    className="w-full text-left px-3 py-2 text-sm text-text-muted hover:text-text hover:bg-surface-elevated rounded transition-colors"
                  >
                    Logout
                  </button>
                </form>
              </div>
            </aside>
            <main className="flex-1 p-6 overflow-auto">{children}</main>
          </div>
        </ToastProvider>
      ) : (
        children
      )}
    </div>
  );
}
