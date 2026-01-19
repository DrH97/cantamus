import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  variant?: "default" | "alternate" | "dark" | "accent";
  size?: "sm" | "md" | "lg" | "xl";
  container?: boolean;
}

const variantStyles = {
  default: "bg-background",
  alternate: "bg-surface",
  dark: "bg-obsidian",
  accent: "bg-gradient-to-b from-surface to-obsidian",
};

const sizeStyles = {
  sm: "py-10 md:py-14",
  md: "py-14 md:py-20",
  lg: "py-20 md:py-28",
  xl: "py-28 md:py-36",
};

export function Section({
  children,
  variant = "default",
  size = "md",
  container = true,
  className,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn(variantStyles[variant], sizeStyles[size], className)}
      {...props}
    >
      {container ? <div className="container">{children}</div> : children}
    </section>
  );
}

interface SectionHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  centered?: boolean;
}

export function SectionHeader({
  title,
  subtitle,
  centered = true,
  className,
  ...props
}: SectionHeaderProps) {
  return (
    <div
      className={cn("mb-10 md:mb-14", centered && "text-center", className)}
      {...props}
    >
      <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-lg text-text-muted md:text-xl">{subtitle}</p>
      )}
    </div>
  );
}

interface SectionDividerProps extends HTMLAttributes<HTMLDivElement> {}

export function SectionDivider({ className, ...props }: SectionDividerProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center py-4 bg-background",
        className,
      )}
      {...props}
    >
      <span className="h-px flex-1 max-w-[200px] bg-gradient-to-r from-transparent via-primary to-transparent" />
      <span className="px-6 text-primary">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <path d="M12 3l1.5 4.5H18l-3.5 2.5 1.5 4.5-4-3-4 3 1.5-4.5L6 7.5h4.5z" />
        </svg>
      </span>
      <span className="h-px flex-1 max-w-[200px] bg-gradient-to-l from-transparent via-primary to-transparent" />
    </div>
  );
}
