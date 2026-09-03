"use client";

import { TextareaHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-muted transition-colors"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            "w-full rounded-lg bg-surface border px-4 py-2.5 text-sm text-text placeholder:text-muted/60 transition-all duration-300 resize-y min-h-[80px]",
            "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary focus:shadow-[0_0_15px_rgba(20,184,166,0.1)]",
            error
              ? "border-error focus:ring-error/30 focus:border-error"
              : "border-border",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-error">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
export { Textarea, type TextareaProps };
