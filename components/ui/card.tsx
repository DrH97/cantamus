import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: "default" | "elevated" | "bordered";
  padding?: "none" | "sm" | "md" | "lg";
}

const variantStyles = {
  default: "bg-surface border border-border",
  elevated: "bg-surface-elevated shadow-xl shadow-black/20",
  bordered: "bg-surface border border-border",
};

const paddingStyles = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export function Card({
  children,
  variant = "bordered",
  padding = "md",
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden transition-all duration-400",
        "hover:-translate-y-2 hover:border-primary hover:shadow-[0_20px_40px_rgba(0,0,0,0.3),0_0_60px_var(--gold-glow)]",
        "before:absolute before:top-0 before:left-0 before:right-0 before:h-[3px] before:bg-gradient-to-r before:from-primary before:to-secondary before:scale-x-0 before:transition-transform before:duration-400 hover:before:scale-x-100",
        variantStyles[variant],
        paddingStyles[padding],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function CardHeader({ children, className, ...props }: CardHeaderProps) {
  return (
    <div className={cn("mb-4", className)} {...props}>
      {children}
    </div>
  );
}

interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
  as?: "h2" | "h3" | "h4";
}

export function CardTitle({
  children,
  as: Tag = "h3",
  className,
  ...props
}: CardTitleProps) {
  return (
    <Tag
      className={cn("text-xl font-semibold text-text", className)}
      {...props}
    >
      {children}
    </Tag>
  );
}

interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function CardContent({
  children,
  className,
  ...props
}: CardContentProps) {
  return (
    <div
      className={cn("text-text-muted leading-relaxed", className)}
      {...props}
    >
      {children}
    </div>
  );
}

interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function CardFooter({ children, className, ...props }: CardFooterProps) {
  return (
    <div className={cn("mt-4 flex items-center gap-3", className)} {...props}>
      {children}
    </div>
  );
}

interface CardIconProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function CardIcon({ children, className, ...props }: CardIconProps) {
  return (
    <div
      className={cn(
        "w-[4.5rem] h-[4.5rem] mx-auto mb-6 flex items-center justify-center",
        "bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/20",
        "transition-all duration-400 group-hover:border-primary/40 group-hover:shadow-[0_0_20px_var(--gold-glow)]",
        "[&>svg]:w-8 [&>svg]:h-8 [&>svg]:text-primary",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
