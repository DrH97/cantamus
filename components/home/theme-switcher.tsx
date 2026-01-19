"use client";

import { motion } from "framer-motion";
import { Palette } from "lucide-react";
import { useId } from "react";
import { cn } from "@/lib/utils";
import type { Theme } from "@/types";

interface ThemeSwitcherProps {
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
}

const themes: { value: Theme; label: string; description: string }[] = [
  {
    value: "african",
    label: "Classical African",
    description: "Bold, regal, gold accents",
  },
  {
    value: "traditional",
    label: "Traditional",
    description: "Burgundy, gold, liturgical",
  },
];

export function ThemeSwitcher({
  currentTheme,
  onThemeChange,
}: ThemeSwitcherProps) {
  const layoutId = useId();

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-2 text-sm text-text-muted">
        <Palette className="h-4 w-4 text-primary" />
        <span>Preview different styles</span>
      </div>
      <div className="inline-flex items-center gap-1 bg-obsidian/90 p-1.5 shadow-xl backdrop-blur-xl border border-border">
        {themes.map((theme) => {
          const isActive = currentTheme === theme.value;
          return (
            <button
              key={theme.value}
              type="button"
              onClick={() => onThemeChange(theme.value)}
              className={cn(
                "relative px-4 py-2.5 text-sm font-medium transition-all duration-300",
                isActive ? "text-obsidian" : "text-text-muted hover:text-text",
              )}
              title={theme.description}
            >
              {isActive && (
                <motion.div
                  layoutId={layoutId}
                  className="absolute inset-0 bg-gradient-to-r from-primary to-primary-dark shadow-[0_0_20px_var(--gold-glow)]"
                  transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
                />
              )}
              <span className="relative z-10">{theme.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
