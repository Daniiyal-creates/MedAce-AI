import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button, Badge, Card } from "@/components/ui";
import Link from "next/link";
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
} from "lucide-react";

/* ===========================
   HERO SECTION
   =========================== */
function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--color-primary)/5_0%,_transparent_70%)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-24 sm:pt-28 sm:pb-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Copy */}
          <div className="space-y-8">
            <Badge variant="ai" className="px-3 py-1">
              <Sparkles className="h-3 w-3" />
              AI-Powered Learning
            </Badge>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
              Your MDCAT Prep,{" "}
              <span className="gradient-text">Powered by AI</span>
            </h1>

            <p className="text-lg text-muted max-w-xl leading-relaxed">
              Adaptive practice. Urdu explanations. Weak-spot tracking. All built
              for the real exam — with questions generated from actual MDCAT
              textbook content.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/signup">
                <Button size="lg">
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
            </div>
          </div>

          {/* Right: Mock MCQ Preview */}
          <div className="hidden lg:block">
            <Card variant="elevated" padding="none" className="overflow-hidden">
              <div className="px-5 py-3 border-b border-border flex items-center justify-between">
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
                    {
                      letter: "B",
                      text: "Na\u207A voltage-gated channels open",
                      state: "correct",
                    },
                    { letter: "C", text: "Na\u207A/K\u207A pump stops working", state: "wrong" },
                    { letter: "D", text: "Myelin sheath dissolves", state: "default" },
                  ].map((opt) => (
                    <div
                      key={opt.letter}
                      className={`flex items-center gap-3 rounded-lg border px-4 py-2.5 text-sm transition-colors ${
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
                        {opt.letter}
                      </span>
                      {opt.text}
                    </div>
                  ))}
                </div>

                {/* Urdu explanation preview */}
                <div className="rounded-lg bg-accent/5 border border-accent/20 p-4">
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
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ===========================
   PROBLEM SECTION
   =========================== */
function ProblemSection() {
  const problems = [
    {
      icon: X,
      title: "Expensive Tutoring",
      description:
        "Quality MDCAT coaching is clustered in major cities and priced out of reach. Students outside these hubs get a fraction of the same support.",
    },
    {
      icon: Shuffle,
      title: "No Personalization",
      description:
        "Existing apps throw the same content at every student. No feedback on what you keep getting wrong, why, or what to study next.",
    },
    {
      icon: Languages,
      title: "The Language Gap",
      description:
        "Many students can read an English MCQ but lose precision when explanations are also in dense academic English. The concept doesn't fully land.",
    },
  ];

  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold">
            MDCAT prep is{" "}
            <span className="text-error">broken</span> for most students
          </h2>
          <p className="mt-4 text-muted max-w-2xl mx-auto">
            Millions prepare for MDCAT every year, yet most lack the tools to
            study smart. Here&apos;s what we&apos;re fixing.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {problems.map((p) => (
            <Card
              key={p.title}
              className="hover:border-error/20 transition-colors"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-error/10 mb-4">
                <p.icon className="h-5 w-5 text-error" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{p.title}</h3>
              <p className="text-sm text-muted leading-relaxed">
                {p.description}
              </p>
            </Card>
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
  const features = [
    {
      icon: BookOpen,
      title: "Authentic Exam Experience",
      description:
        "Every MCQ is in English, exactly as students will encounter on test day. Interface mirrors the real MDCAT format — no shortcuts.",
      badge: null,
    },
    {
      icon: MessageCircle,
      title: "Urdu Explanations On Demand",
      description:
        "When a concept doesn't click, get it explained in code-mixed Urdu. Technical terms stay in English; the reasoning around them is in Urdu.",
      badge: "AI-Powered",
    },
    {
      icon: Target,
      title: "Adaptive Weak-Spot Tracking",
      description:
        "The app tracks where you go wrong — by topic, by concept, by pattern — and directs future practice to your weakest areas automatically.",
      badge: null,
    },
  ];

  return (
    <section className="py-20 sm:py-28 bg-surface/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <Badge variant="ai" className="mb-4">
            <Sparkles className="h-3 w-3" />
            Smart Features
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold">
            Built for how students{" "}
            <span className="gradient-text">actually learn</span>
          </h2>
        </div>

        <div className="space-y-8">
          {features.map((f, i) => (
            <Card
              key={f.title}
              padding="lg"
              className={`flex flex-col ${
                i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              } items-start md:items-center gap-6 hover:border-primary/20 transition-colors`}
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
  const steps = [
    {
      num: "01",
      title: "Choose a Topic",
      description:
        "Pick from 15 MDCAT Biology chapters. Filter by category or jump straight to your weakest area.",
    },
    {
      num: "02",
      title: "AI Generates Your MCQs",
      description:
        "Our RAG pipeline retrieves relevant textbook content and generates high-quality MCQs grounded in the actual MDCAT syllabus.",
    },
    {
      num: "03",
      title: "Learn from Your Mistakes",
      description:
        "Get instant feedback with detailed explanations in English or Urdu. Weak-spot tracking directs your next practice session.",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold">How it works</h2>
          <p className="mt-4 text-muted">
            Three simple steps to smarter MDCAT prep.
          </p>
        </div>

        <div className="relative max-w-2xl mx-auto">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-border md:left-1/2" />

          <div className="space-y-12">
            {steps.map((s) => (
              <div key={s.num} className="relative flex items-start gap-6">
                {/* Number circle */}
                <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-white font-bold text-sm shadow-lg shadow-primary/20">
                  {s.num}
                </div>
                <div className="pt-1">
                  <h3 className="text-lg font-semibold mb-1">{s.title}</h3>
                  <p className="text-sm text-muted leading-relaxed">
                    {s.description}
                  </p>
                </div>
              </div>
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
function StatsSection() {
  const stats = [
    { icon: BookOpen, value: "15", label: "Chapters Covered" },
    { icon: Zap, value: "AI", label: "Generated Questions" },
    { icon: Globe, value: "Urdu + English", label: "Explanations" },
    { icon: TrendingUp, value: "Adaptive", label: "Coaching Engine" },
  ];

  return (
    <section className="py-16 bg-surface/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="text-center space-y-2">
              <div className="flex justify-center">
                <s.icon className="h-6 w-6 text-primary" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-text">
                {s.value}
              </p>
              <p className="text-sm text-muted">{s.label}</p>
            </div>
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
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Card
          variant="elevated"
          padding="none"
          className="relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
          <div className="relative px-8 py-16 sm:py-20 text-center space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold">
              Ready to ace MDCAT?
            </h2>
            <p className="text-muted max-w-lg mx-auto">
              Join thousands of students preparing smarter with AI-powered
              adaptive practice and Urdu explanations.
            </p>
            <Link href="/signup">
              <Button size="lg">
                Get Started Free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <p className="text-xs text-muted">No credit card required</p>
          </div>
        </Card>
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
