"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Music, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { navItems, siteConfig } from "@/data/site-config";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const pathname = usePathname();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close mobile nav when route changes
  useEffect(() => {
    if (pathname) {
      onClose();
    }
  }, [pathname, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden"
            onClick={onClose}
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-72 bg-obsidian border-l border-border shadow-2xl md:hidden"
          >
            {/* Gold accent line */}
            <div className="absolute top-0 left-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-primary/20 to-transparent" />

            <div className="flex h-header items-center justify-between border-b border-border px-4">
              <Link
                href="/"
                className="flex items-center gap-3 text-lg font-bold text-text"
                onClick={onClose}
              >
                <Music className="h-6 w-6 text-primary" />
                <span className="tracking-wide">{siteConfig.name}</span>
              </Link>
              <button
                type="button"
                className="p-2 text-text-muted hover:text-primary transition-colors duration-300"
                onClick={onClose}
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="p-4">
              <ul className="space-y-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          "block px-4 py-3 text-base font-medium transition-all duration-300 relative",
                          isActive
                            ? "text-primary bg-primary/10"
                            : "text-text-muted hover:text-text hover:bg-surface",
                          "after:absolute after:left-0 after:top-1/2 after:-translate-y-1/2 after:w-0 after:h-6 after:bg-primary after:transition-all after:duration-300",
                          isActive && "after:w-0.5",
                        )}
                        onClick={onClose}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="absolute bottom-0 left-0 right-0 border-t border-border p-4">
              <p className="text-sm text-text-muted text-center italic">
                &ldquo;{siteConfig.tagline}&rdquo;
              </p>
              <p className="text-xs text-primary text-center mt-1 tracking-wide">
                {siteConfig.psalm}
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
