"use client";

import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

type CardVariant = "default" | "elevated" | "bordered" | "glass";
type CardPadding = "none" | "sm" | "md" | "lg";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: CardPadding;
  hoverable?: boolean;
}

const variantClasses: Record<CardVariant, string> = {
  default: "bg-surface border border-border",
  elevated: "bg-surface border border-border shadow-lg shadow-black/20",
  bordered: "bg-transparent border border-border",
  glass: "bg-glass border border-white/5 backdrop-blur-xl",
};

const paddingClasses: Record<CardPadding, string> = {
  none: "",
  sm: "p-3",
  md: "p-5",
  lg: "p-7",
};

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", padding = "md", hoverable = false, children, ...props }, ref) => {
    if (hoverable) {
      return (
        <motion.div
          ref={ref}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className={cn(
            "rounded-xl transition-colors duration-200",
            variantClasses[variant],
            paddingClasses[padding],
            hoverable && "hover:shadow-lg hover:shadow-black/20 hover:border-primary/20",
            className
          )}
          {...props}
        >
          {children}
        </motion.div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl transition-colors duration-200",
          variantClasses[variant],
          paddingClasses[padding],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
export { Card, type CardProps };
