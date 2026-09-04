"use client";

import { Card, Badge } from "@/components/ui";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { BookOpen, MessageCircle, Target, Sparkles } from "lucide-react";

const features = [
  { icon: BookOpen, title: "Authentic Exam Experience", description: "Every MCQ is in English, exactly as students will encounter on test day. Interface mirrors the real MDCAT format — no shortcuts.", badge: null },
  { icon: MessageCircle, title: "Urdu Explanations On Demand", description: "When a concept doesn't click, get it explained in code-mixed Urdu. Technical terms stay in English; the reasoning around them is in Urdu.", badge: "AI-Powered" },
  { icon: Target, title: "Adaptive Weak-Spot Tracking", description: "The app tracks where you go wrong — by topic, by concept, by pattern — and directs future practice to your weakest areas automatically.", badge: null },
];

export default function FeaturesSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="features" ref={ref} className="py-20 sm:py-28 bg-surface/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <Badge variant="ai" className="mb-4">
            <Sparkles className="h-3 w-3" />
            Smart Features
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold">
            Built for how students{" "}<span className="gradient-text">actually learn</span>
          </h2>
        </motion.div>

        <div className="space-y-8">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: i * 0.15, type: "spring", damping: 20, stiffness: 150 }}
            >
              <Card
                hoverable
                padding="lg"
                className={`flex flex-col ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} items-start md:items-center gap-6 hover:border-primary/20 transition-colors`}
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <f.icon className="h-7 w-7 text-primary" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-semibold">{f.title}</h3>
                    {f.badge && <Badge variant="ai">{f.badge}</Badge>}
                  </div>
                  <p className="text-muted leading-relaxed">{f.description}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
