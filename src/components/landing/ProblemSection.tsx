"use client";

import { Card } from "@/components/ui";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { X, Shuffle, Languages } from "lucide-react";

const problems = [
  { icon: X, title: "Expensive Tutoring", description: "Quality MDCAT coaching is clustered in major cities and priced out of reach. Students outside these hubs get a fraction of the same support." },
  { icon: Shuffle, title: "No Personalization", description: "Existing apps throw the same content at every student. No feedback on what you keep getting wrong, why, or what to study next." },
  { icon: Languages, title: "The Language Gap", description: "Many students can read an English MCQ but lose precision when explanations are also in dense academic English. The concept doesn't fully land." },
];

export default function ProblemSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold">
            MDCAT prep is{" "}<span className="text-error">broken</span> for most students
          </h2>
          <p className="mt-4 text-muted max-w-2xl mx-auto">
            Millions prepare for MDCAT every year, yet most lack the tools to
            study smart. Here&apos;s what we&apos;re fixing.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {problems.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 30, x: i % 2 === 0 ? -20 : 20 }}
              animate={inView ? { opacity: 1, y: 0, x: 0 } : {}}
              transition={{ delay: i * 0.15, type: "spring", damping: 20, stiffness: 150 }}
            >
              <Card hoverable className="h-full hover:border-error/20 transition-colors">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-error/10 mb-4">
                  <p.icon className="h-5 w-5 text-error" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{p.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{p.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
