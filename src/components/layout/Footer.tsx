import Link from "next/link";
import { Brain, Github, Twitter, Linkedin, Mail, Heart } from "lucide-react";

const footerLinks = {
  product: [
    { label: "Features", href: "/#features" },
    { label: "Practice", href: "/practice" },
    { label: "Study Plan", href: "/study-plan" },
    { label: "Dashboard", href: "/dashboard" },
  ],
  resources: [
    { label: "How It Works", href: "/#how-it-works" },
    { label: "MDCAT Syllabus", href: "#" },
    { label: "FAQ", href: "#" },
  ],
  company: [
    { label: "About", href: "#" },
    { label: "Contact", href: "mailto:hello@medace.ai" },
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
  ],
};

const socialLinks = [
  { icon: Github, href: "#", label: "GitHub" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Mail, href: "mailto:hello@medace.ai", label: "Email" },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-surface/30">
      {/* Animated gradient line at top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <Brain className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm font-bold text-text">
                Med<span className="text-primary">Ace</span> AI
              </span>
            </Link>
            <p className="text-xs text-muted leading-relaxed mb-4">
              AI-powered adaptive MDCAT preparation with Urdu explanations and real-time weak-spot tracking.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-3">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:text-primary hover:bg-primary/10 transition-all"
                  aria-label={s.label}
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Product links */}
          <div>
            <h4 className="text-xs font-semibold text-text uppercase tracking-wider mb-4">Product</h4>
            <ul className="space-y-2.5">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources links */}
          <div>
            <h4 className="text-xs font-semibold text-text uppercase tracking-wider mb-4">Resources</h4>
            <ul className="space-y-2.5">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h4 className="text-xs font-semibold text-text uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted">
            &copy; {new Date().getFullYear()} MedAce AI. All rights reserved.
          </p>
          <p className="text-xs text-muted flex items-center gap-1">
            Made with <Heart className="h-3 w-3 text-error fill-error" /> for MDCAT students in Pakistan
          </p>
        </div>
      </div>
    </footer>
  );
}
