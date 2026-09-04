"use client";

import { Button } from "@/components/ui";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ type: "spring", damping: 20, stiffness: 150 }}
        >
          <div className="relative overflow-hidden rounded-xl border border-border bg-surface shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
            {/* Animated gradient border */}
            <div className="absolute inset-0 rounded-xl gradient-border" />
            <div className="relative px-8 py-16 sm:py-20 text-center space-y-6">
              <motion.h2
                className="text-3xl sm:text-4xl font-bold"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 }}
              >
                Ready to ace MDCAT?
              </motion.h2>
              <motion.p
                className="text-muted max-w-lg mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 }}
              >
                Join thousands of students preparing smarter with AI-powered
                adaptive practice and Urdu explanations.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4 }}
              >
                <Link href="/signup">
                  <Button size="lg" glow>
                    Get Started Free
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </motion.div>
              <motion.p
                className="text-xs text-muted"
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ delay: 0.5 }}
              >
                No credit card required
              </motion.p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
