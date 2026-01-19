"use client";

import { Menu, Music } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { navItems, siteConfig } from "@/data/site-config";
import { cn } from "@/lib/utils";
import { MobileNav } from "./mobile-nav";

export function Header() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 h-header bg-obsidian/90 backdrop-blur-xl border-b border-border">
        {/* Gold accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        <div className="container flex h-full items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3 text-xl font-bold text-text transition-all duration-300 hover:text-primary"
          >
            <Music className="h-7 w-7 text-primary" />
            <span className="tracking-wide">{siteConfig.name}</span>
          </Link>

          <nav className="hidden md:block">
            <ul className="flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "relative px-5 py-2 text-sm font-medium transition-all duration-300",
                        isActive
                          ? "text-primary"
                          : "text-text-muted hover:text-text",
                        "after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-0.5 after:bg-primary after:transition-all after:duration-300",
                        isActive ? "after:w-[60%]" : "hover:after:w-[60%]",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <button
            type="button"
            className="p-2 text-text-muted hover:text-primary transition-colors duration-300 md:hidden"
            onClick={() => setIsMobileNavOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </header>

      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
      />
    </>
  );
}
