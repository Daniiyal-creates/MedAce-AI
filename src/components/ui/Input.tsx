"use client";

import { InputHTMLAttributes, forwardRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, leftIcon, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-muted transition-colors peer-focus-within:text-primary"
          >
            {label}
          </label>
        )}
        <div className="relative group">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted transition-colors group-focus-within:text-primary">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "peer w-full rounded-lg bg-surface border px-4 py-2.5 text-sm text-text placeholder:text-muted/60 transition-all duration-300",
              "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary focus:shadow-[0_0_15px_rgba(20,184,166,0.1)]",
              leftIcon && "pl-10",
              error
                ? "border-error focus:ring-error/30 focus:border-error animate-[shake_0.3s_ease-in-out]"
                : "border-border",
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-error">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
export { Input, type InputProps };
