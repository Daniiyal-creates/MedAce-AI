import Link from "next/link";
import { Button } from "@/components/ui";
import { APP_NAME_URDU } from "@/lib/constants";
import {
  BookOpen,
  Brain,
  Target,
  CalendarDays,
  ArrowLeft,
  GraduationCap,
  Sparkles,
  BarChart3,
} from "lucide-react";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <header className="border-b border-border bg-surface/95 backdrop-blur sticky top-0 z-30">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white font-bold text-lg">
              م
            </div>
            <span className="text-xl font-bold text-text">
              {APP_NAME_URDU}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                لاگ ان
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">سائن اپ</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 px-4">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
            <GraduationCap className="h-4 w-4" />
            MDCAT کی تیاری — اردو میں
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text leading-tight mb-6">
            <span className="text-primary">{APP_NAME_URDU}</span>
            <br />
            آپ کا ذاتی AI ٹیوٹر
          </h1>

          <p className="text-lg md:text-xl text-muted max-w-2xl mx-auto mb-8">
            MDCAT کی تیاری کے لیے AI ٹیوٹر جو اردو میں سکھاتا ہے، کوئز کراتا
            ہے، آپ کی کمزوریوں کو پہچانتا ہے، اور ذاتی مطالعہ کا منصوبہ بناتا
            ہے۔
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto">
                شروع کریں — بالکل مفت
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                مزید جانیں
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 px-4 bg-surface">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-text text-center mb-12">
            آپ کی کامیابی کے لیے خاص خصوصیات
          </h2>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: BookOpen,
                title: "اردو میں وضاحت",
                description:
                  "ہر تصور سادہ اور واضح اردو میں سمجھایا جاتا ہے — کوئی انگریزی الجھن نہیں",
                color: "text-primary bg-primary/10",
              },
              {
                icon: Brain,
                title: "لا محدود کوئز",
                description:
                  "MDCAT نصاب کے مطابق AI سے تیار شدہ سوالات — ہر بار نئے سوالات",
                color: "text-info bg-blue-100",
              },
              {
                icon: Target,
                title: "کمزوریوں کی نشاندہی",
                description:
                  "آپ کی غلطیوں کو ٹریک کرتا ہے اور کمزور موضوعات پر خاص توجہ دیتا ہے",
                color: "text-error bg-red-100",
              },
              {
                icon: CalendarDays,
                title: "ذاتی مطالعہ کا منصوبہ",
                description:
                  "ہر ہفتے آپ کے لیے مخصوص مطالعہ کا شیڈول — آپ کی کارکردگی کے مطابق",
                color: "text-accent bg-amber-100",
              },
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={i}
                  className="rounded-2xl bg-bg border border-border p-6 hover:shadow-md transition-shadow"
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${feature.color} mb-4`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-text mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-text text-center mb-12">
            یہ کیسے کام کرتا ہے؟
          </h2>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: "١",
                title: "سائن اپ کریں",
                description: "مفت اکاؤنٹ بنائیں اور اپنا سفر شروع کریں",
                icon: Sparkles,
              },
              {
                step: "٢",
                title: "کوئز دیں",
                description:
                  "موضوع منتخب کریں اور AI سے تیار شدہ سوالات حل کریں",
                icon: Brain,
              },
              {
                step: "٣",
                title: "ذاتی منصوبہ حاصل کریں",
                description:
                  "آپ کی کارکردگی کے مطابق ہفتہ وار مطالعہ کا منصوبہ بنایا جاتا ہے",
                icon: BarChart3,
              },
            ].map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={i} className="text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary text-2xl font-bold mx-auto mb-4">
                    {step.step}
                  </div>
                  <Icon className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-text mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-primary/5">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-text mb-4">
            آج ہی اپنی MDCAT تیاری شروع کریں
          </h2>
          <p className="text-muted mb-8">
            مفت سائن اپ کریں اور دیکھیں کہ AI ٹیوٹر آپ کی تیاری کو کیسے
            بدلتا ہے
          </p>
          <Link href="/signup">
            <Button size="lg">
              مفت سائن اپ کریں
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white font-bold text-sm">
              م
            </div>
            <span className="font-bold text-text">{APP_NAME_URDU}</span>
          </div>
          <p className="text-sm text-muted">
            MDCAT کی تیاری اردو میں — پاکستانی طلبا کے لیے
          </p>
        </div>
      </footer>
    </div>
  );
}
