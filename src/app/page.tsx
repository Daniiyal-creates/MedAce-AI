"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button, Badge, Card } from "@/components/ui";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion, type Variants } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  ChevronRight,
  CheckCircle,
} from "lucide-react";

// Below-the-fold sections are split into separate chunks so the landing
// route's initial JavaScript stays small. They are still server-rendered
// (SEO-safe) — the chunks simply load in parallel instead of blocking
// the first paint.
const ProblemSection = dynamic(() => import("@/components/landing/ProblemSection"));
const FeaturesSection = dynamic(() => import("@/components/landing/FeaturesSection"));
const HowItWorksSection = dynamic(() => import("@/components/landing/HowItWorksSection"));
const StatsSection = dynamic(() => import("@/components/landing/StatsSection"));
const CTASection = dynamic(() => import("@/components/landing/CTASection"));

/* Animation variants */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, type: "spring", damping: 25, stiffness: 200 },
  }),
};

const stagger: Variants = {
  visible: { transition: { staggerChildren: 0.1 } },
};

/* ===========================
   HERO SECTION
   =========================== */
function HeroSection() {
  return (
    <section className="relative overflow-hidden min-h-[90vh] flex items-center">
      {/* Animated gradient mesh background */}
      <div className="absolute inset-0 gradient-mesh" />
      {/* Dot grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle, #14b8a6 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-24 sm:pt-28 sm:pb-32 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Copy with staggered entrance */}
          <motion.div
            className="space-y-8"
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            <motion.div variants={fadeUp} custom={0}>
              <Badge variant="ai" className="px-3 py-1">
                <Sparkles className="h-3 w-3" />
                AI-Powered Learning
              </Badge>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              custom={1}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight"
            >
              Your MDCAT Prep,{" "}
              <span className="gradient-text">Powered by AI</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              custom={2}
              className="text-lg text-muted max-w-xl leading-relaxed"
            >
              Adaptive practice. Urdu explanations. Weak-spot tracking. All built
              for the real exam — with questions generated from actual MDCAT
              textbook content.
            </motion.p>

            <motion.div
              variants={fadeUp}
              custom={3}
              className="flex flex-wrap gap-4"
            >
              <Link href="/signup">
                <Button size="lg" glow>
                  Start Practicing
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button variant="ghost" size="lg">
                  See How It Works
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </a>
            </motion.div>

            {/* Social proof */}
            <motion.div variants={fadeUp} custom={4} className="flex items-center gap-4 pt-4">
              <div className="flex -space-x-2">
                {["bg-primary", "bg-accent", "bg-info", "bg-success"].map((bg, i) => (
                  <div
                    key={i}
                    className={`h-8 w-8 rounded-full ${bg} border-2 border-bg flex items-center justify-center text-[10px] text-white font-bold`}
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-sm font-semibold text-text">Join 1,000+ students</p>
                <p className="text-xs text-muted">preparing smarter every day</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Floating MCQ Preview Card */}
          <motion.div
            className="hidden lg:block"
            initial={{ opacity: 0, x: 50, rotateY: -5 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ delay: 0.3, type: "spring", damping: 20, stiffness: 150 }}
          >
            {/* CSS keyframe float — runs on the compositor instead of the
                framer-motion JS ticker */}
            <div className="animate-float">
              <Card variant="elevated" padding="none" className="overflow-hidden shadow-2xl shadow-black/40">
                <div className="px-5 py-3 border-b border-border flex items-center justify-between bg-surface/80">
                  <div className="flex items-center gap-2">
                    <Badge variant="default">Ch 5</Badge>
                    <span className="text-sm font-medium text-text">
                      Nervous System
                    </span>
                  </div>
                  <span className="text-xs text-muted">Question 3 of 10</span>
                </div>

                <div className="p-5 space-y-5">
                  <p className="text-sm text-text leading-relaxed">
                    During depolarization of a neuron, which event occurs first?
                  </p>

                  <div className="space-y-2">
                    {[
                      { letter: "A", text: "K\u207A channels open", state: "default" },
                      { letter: "B", text: "Na\u207A voltage-gated channels open", state: "correct" },
                      { letter: "C", text: "Na\u207A/K\u207A pump stops working", state: "wrong" },
                      { letter: "D", text: "Myelin sheath dissolves", state: "default" },
                    ].map((opt, i) => (
                      <motion.div
                        key={opt.letter}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        className={`flex items-center gap-3 rounded-lg border px-4 py-2.5 text-sm transition-all ${
                          opt.state === "correct"
                            ? "border-success bg-success/10 text-success"
                            : opt.state === "wrong"
                            ? "border-error bg-error/10 text-error"
                            : "border-border text-muted"
                        }`}
                      >
                        <span
                          className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                            opt.state === "correct"
                              ? "bg-success text-white"
                              : opt.state === "wrong"
                              ? "bg-error text-white"
                              : "bg-border text-muted"
                          }`}
                        >
                          {opt.state === "correct" ? <CheckCircle className="h-3.5 w-3.5" /> : opt.letter}
                        </span>
                        {opt.text}
                      </motion.div>
                    ))}
                  </div>

                  {/* Urdu explanation */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="rounded-lg bg-accent/5 border border-accent/20 p-4"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="ai">
                        <Sparkles className="h-3 w-3" />
                        AI Explanation
                      </Badge>
                    </div>
                    <p className="text-xs text-accent-light leading-relaxed font-urdu" dir="auto">
                      Depolarization ke dauran, voltage-gated Na+ channels sab se
                      pehle khulte hain...
                    </p>
                  </motion.div>
                </div>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ===========================
   PAGE
   =========================== */
export default function HomePage() {
  return (
    <>
      <Navbar variant="landing" />
      <main>
        <HeroSection />
        <ProblemSection />
        <FeaturesSection />
        <HowItWorksSection />
        <StatsSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
