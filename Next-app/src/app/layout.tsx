import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "@/providers/QueryProvider";
import { AuthProvider } from "@/providers/AuthProvider";

export const metadata: Metadata = {
  title: "MedAce AI - MDCAT کی تیاری اردو میں",
  description:
    "MDCAT کی تیاری کے لیے AI ٹیوٹر جو اردو میں سکھاتا ہے، کوئز کراتا ہے، اور آپ کی کمزوریوں کو دور کرتا ہے۔",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ur" dir="rtl" className="h-full">
      <body className="min-h-full antialiased">
        <QueryProvider>
          <AuthProvider>{children}</AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
