"use client";

import { motion } from "framer-motion";
import { createContext, type ReactNode, use, useId, useState } from "react";
import { cn } from "@/lib/utils";

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (value: string) => void;
  layoutId: string;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const context = use(TabsContext);
  if (!context) {
    throw new Error("Tabs components must be used within a Tabs provider");
  }
  return context;
}

interface TabsProps {
  defaultValue: string;
  children: ReactNode;
  className?: string;
  onValueChange?: (value: string) => void;
}

export function Tabs({
  defaultValue,
  children,
  className,
  onValueChange,
}: TabsProps) {
  const [activeTab, setActiveTabState] = useState(defaultValue);
  const layoutId = useId();

  const setActiveTab = (value: string) => {
    setActiveTabState(value);
    onValueChange?.(value);
  };

  return (
    <TabsContext value={{ activeTab, setActiveTab, layoutId }}>
      <div className={cn("w-full", className)}>{children}</div>
    </TabsContext>
  );
}

interface TabsListProps {
  children: ReactNode;
  className?: string;
}

export function TabsList({ children, className }: TabsListProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-lg bg-background-alt p-1",
        className,
      )}
      role="tablist"
    >
      {children}
    </div>
  );
}

interface TabsTriggerProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export function TabsTrigger({ value, children, className }: TabsTriggerProps) {
  const { activeTab, setActiveTab, layoutId } = useTabsContext();
  const isActive = activeTab === value;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      data-state={isActive ? "active" : "inactive"}
      className={cn(
        "relative px-4 py-2 text-sm font-medium transition-colors",
        isActive ? "text-text" : "text-text-muted hover:text-text",
        className,
      )}
      onClick={() => setActiveTab(value)}
    >
      {isActive && (
        <motion.div
          layoutId={layoutId}
          className="absolute inset-0 rounded-md bg-surface shadow-sm"
          transition={{ type: "spring", duration: 0.3, bounce: 0.15 }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </button>
  );
}

interface TabsContentProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export function TabsContent({ value, children, className }: TabsContentProps) {
  const { activeTab } = useTabsContext();

  if (activeTab !== value) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      role="tabpanel"
      className={cn("mt-4", className)}
    >
      {children}
    </motion.div>
  );
}
