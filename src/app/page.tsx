"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button, Badge, Card } from "@/components/ui";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  MessageCircle,
  Target,
  Sparkles,
  X,
  Shuffle,
  Languages,
  ChevronRight,
  Zap,
  Globe,
  TrendingUp,
  CheckCircle,
} from "lucide-react";

/* Animation variants */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, type: "spring", damping: 25, stiffness: 200 },
  }),
};

const stagger = {
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
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
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
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ===========================
   PROBLEM SECTION
   =========================== */
function ProblemSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const problems = [
    { icon: X, title: "Expensive Tutoring", description: "Quality MDCAT coaching is clustered in major cities and priced out of reach. Students outside these hubs get a fraction of the same support." },
    { icon: Shuffle, title: "No Personalization", description: "Existing apps throw the same content at every student. No feedback on what you keep getting wrong, why, or what to study next." },
    { icon: Languages, title: "The Language Gap", description: "Many students can read an English MCQ but lose precision when explanations are also in dense academic English. The concept doesn't fully land." },
  ];

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

/* ===========================
   FEATURES SECTION
   =========================== */
function FeaturesSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const features = [
    { icon: BookOpen, title: "Authentic Exam Experience", description: "Every MCQ is in English, exactly as students will encounter on test day. Interface mirrors the real MDCAT format — no shortcuts.", badge: null },
    { icon: MessageCircle, title: "Urdu Explanations On Demand", description: "When a concept doesn't click, get it explained in code-mixed Urdu. Technical terms stay in English; the reasoning around them is in Urdu.", badge: "AI-Powered" },
    { icon: Target, title: "Adaptive Weak-Spot Tracking", description: "The app tracks where you go wrong — by topic, by concept, by pattern — and directs future practice to your weakest areas automatically.", badge: null },
  ];

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
                <motion.div
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <f.icon className="h-7 w-7 text-primary" />
                </motion.div>
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

/* ===========================
   HOW IT WORKS SECTION
   =========================== */
function HowItWorksSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const steps = [
    { num: "01", title: "Choose a Topic", description: "Pick from 15 MDCAT Biology chapters. Filter by category or jump straight to your weakest area." },
    { num: "02", title: "AI Generates Your MCQs", description: "Our RAG pipeline retrieves relevant textbook content and generates high-quality MCQs grounded in the actual MDCAT syllabus." },
    { num: "03", title: "Learn from Your Mistakes", description: "Get instant feedback with detailed explanations in English or Urdu. Weak-spot tracking directs your next practice session." },
  ];

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

/* ===========================
   STATS SECTION
   =========================== */
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

function StatsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  const stats = [
    { icon: BookOpen, value: 15, label: "Chapters Covered", suffix: "" },
    { icon: Zap, value: "AI", label: "Generated Questions", suffix: "" },
    { icon: Globe, value: "Urdu + English", label: "Explanations", suffix: "" },
    { icon: TrendingUp, value: "Adaptive", label: "Coaching Engine", suffix: "" },
  ];

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
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  className="p-3 rounded-xl bg-primary/10"
                >
                  <s.icon className="h-6 w-6 text-primary" />
                </motion.div>
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

/* ===========================
   CTA SECTION
   =========================== */
function CTASection() {
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
          <Card
            variant="elevated"
            padding="none"
            className="relative overflow-hidden"
          >
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
          </Card>
        </motion.div>
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
