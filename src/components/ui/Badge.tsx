import React from "react";
import { ToolCategory } from "@/data/tools";

export interface BadgeProps {
  children: React.ReactNode;
  category?: ToolCategory;
  variant?: "default" | "outline" | "category" | "success" | "warning";
  className?: string;
}

export function Badge({ children, category, variant = "default", className = "" }: BadgeProps) {
  const categoryStyles: Record<ToolCategory, string> = {
    student: "bg-[var(--primary)]/10 text-[var(--primary)] border-[var(--primary)]/20",
    developer: "bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/20",
    document: "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20",
    image: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20",
    finance: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/20",
    everyday: "bg-violet-500/10 text-violet-700 dark:text-violet-300 border-violet-500/20",
  };

  const variantStyles = {
    default: "bg-[var(--muted)] text-[var(--foreground)] border-[var(--border)]",
    outline: "bg-transparent text-[var(--muted-foreground)] border-[var(--border)]",
    category: category ? categoryStyles[category] : categoryStyles.everyday,
    success: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
