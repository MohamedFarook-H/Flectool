"use client";

import React, { forwardRef } from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "glass";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "md", isLoading = false, children, disabled, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] select-none cursor-pointer";

    const sizeStyles = {
      sm: "h-9 px-3.5 text-xs gap-1.5",
      md: "h-11 px-5 text-sm gap-2",
      lg: "h-13 px-6 text-base gap-2.5 rounded-2xl",
      icon: "h-10 w-10 p-0 text-sm",
    };

    const variantStyles = {
      primary:
        "bg-indigo-600 text-white hover:bg-indigo-500 shadow-md shadow-indigo-500/20 dark:bg-indigo-500 dark:hover:bg-indigo-400 focus-visible:ring-indigo-500",
      secondary:
        "bg-[var(--muted)] text-[var(--foreground)] hover:bg-[var(--border)] focus-visible:ring-[var(--border)]",
      outline:
        "border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--muted)] focus-visible:ring-[var(--border)]",
      ghost:
        "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] focus-visible:ring-[var(--border)]",
      danger:
        "bg-rose-500 text-white hover:bg-rose-600 shadow-sm shadow-rose-500/20 focus-visible:ring-rose-500",
      glass:
        "bg-[var(--card)] backdrop-blur-md border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--muted)] shadow-sm",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
