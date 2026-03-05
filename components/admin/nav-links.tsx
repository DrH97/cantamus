"use client";

import { Calendar, Heart, LayoutDashboard, Music } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/hymns", label: "Hymns", icon: Music, exact: false },
  {
    href: "/admin/mass-programs",
    label: "Mass Programs",
    icon: Calendar,
    exact: false,
  },
  { href: "/admin/wedding", label: "Wedding", icon: Heart, exact: false },
];

export function AdminNavLinks() {
  const pathname = usePathname();

  return (
    <nav className="flex-1 p-3 space-y-1">
      {navItems.map((item) => {
        const isActive = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-2 px-3 py-2 text-sm rounded transition-colors ${
              isActive
                ? "bg-primary/10 text-primary font-medium"
                : "text-text-muted hover:text-text hover:bg-surface-elevated"
            }`}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
