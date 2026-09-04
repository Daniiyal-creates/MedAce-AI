"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { BookOpen, Zap, Globe, TrendingUp } from "lucide-react";

const stats = [
  { icon: BookOpen, value: 15, label: "Chapters Covered", suffix: "" },
  { icon: Zap, value: "AI", label: "Generated Questions", suffix: "" },
  { icon: Globe, value: "Urdu + English", label: "Explanations", suffix: "" },
  { icon: TrendingUp, value: "Adaptive", label: "Coaching Engine", suffix: "" },
];

function AnimatedCounter({ value, suffix = "" }: { value: number | string; suffix?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);
  const numValue = typeof value === "number" ? value : 0;

  useEffect(() => {
    if (inView && typeof value === "number") {
      const duration = 1500;
      const steps = 60;
      const increment = numValue / steps;
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= numValue) {
          setCount(numValue);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);
      return () => clearInterval(timer);
    }
  }, [inView, value, numValue]);

  return (
    <span ref={ref}>
      {typeof value === "number" ? count : value}{suffix}
    </span>
  );
}

export default function StatsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section ref={ref} className="py-16 bg-surface/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              className="text-center space-y-2"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, type: "spring", damping: 20 }}
            >
              <div className="flex justify-center">
                <div className="p-3 rounded-xl bg-primary/10">
                  <s.icon className="h-6 w-6 text-primary" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-text">
                {typeof s.value === "number" ? (
                  <AnimatedCounter value={s.value} suffix={s.suffix} />
                ) : (
                  <>{s.value}</>
                )}
              </p>
              <p className="text-sm text-muted">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
