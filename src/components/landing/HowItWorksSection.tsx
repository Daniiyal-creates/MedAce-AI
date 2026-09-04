"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const steps = [
  { num: "01", title: "Choose a Topic", description: "Pick from 15 MDCAT Biology chapters. Filter by category or jump straight to your weakest area." },
  { num: "02", title: "AI Generates Your MCQs", description: "Our RAG pipeline retrieves relevant textbook content and generates high-quality MCQs grounded in the actual MDCAT syllabus." },
  { num: "03", title: "Learn from Your Mistakes", description: "Get instant feedback with detailed explanations in English or Urdu. Weak-spot tracking directs your next practice session." },
];

export default function HowItWorksSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="how-it-works" ref={ref} className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold">How it works</h2>
          <p className="mt-4 text-muted">Three simple steps to smarter MDCAT prep.</p>
        </motion.div>

        <div className="relative max-w-2xl mx-auto">
          {/* Animated vertical line */}
          <svg className="absolute left-6 top-0 h-full w-1 md:left-1/2" viewBox="0 0 4 400" preserveAspectRatio="none">
            <motion.line
              x1="2" y1="0" x2="2" y2="400"
              stroke="url(#lineGrad)"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={inView ? { pathLength: 1 } : {}}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
            <defs>
              <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#14b8a6" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>

          <div className="space-y-12">
            {steps.map((s, i) => (
              <motion.div
                key={s.num}
                className="relative flex items-start gap-6"
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.2, type: "spring", damping: 20 }}
              >
                <motion.div
                  className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-white font-bold text-sm shadow-lg shadow-primary/20"
                  animate={inView ? { scale: [0.8, 1.1, 1] } : {}}
                  transition={{ delay: 0.5 + i * 0.2, duration: 0.5 }}
                >
                  {s.num}
                </motion.div>
                <div className="pt-1">
                  <h3 className="text-lg font-semibold mb-1">{s.title}</h3>
                  <p className="text-sm text-muted leading-relaxed">{s.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
