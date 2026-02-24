import type { Metadata } from "next";
import Link from "next/link";
import { getSessionUserId } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Admin | Cantamus",
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

  // Allow login page without auth
  // Layout wraps all /admin/* pages, but we check auth here
  // Login page handles its own rendering

  return (
    <div className="min-h-screen bg-background">
      {authed ? (
        <div className="flex min-h-screen">
          <aside className="w-56 bg-surface border-r border-border flex flex-col">
            <div className="p-4 border-b border-border">
              <Link
                href="/admin"
                className="text-lg font-bold text-primary tracking-wide"
              >
                Cantamus Admin
              </Link>
            </div>
            <nav className="flex-1 p-3 space-y-1">
              <NavLink href="/admin">Dashboard</NavLink>
              <NavLink href="/admin/hymns">Hymns</NavLink>
              <NavLink href="/admin/mass-programs">Mass Programs</NavLink>
              <NavLink href="/admin/wedding">Wedding</NavLink>
            </nav>
            <div className="p-3 border-t border-border space-y-1">
              <NavLink href="/">View Site</NavLink>
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
      ) : (
        children
      )}
    </div>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="block px-3 py-2 text-sm text-text-muted hover:text-text hover:bg-surface-elevated rounded transition-colors"
    >
      {children}
    </Link>
  );
}
