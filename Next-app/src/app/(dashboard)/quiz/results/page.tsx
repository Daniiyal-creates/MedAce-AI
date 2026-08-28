"use client";

import Link from "next/link";
import { Button, Card } from "@/components/ui";
import { ArrowRight } from "lucide-react";

export default function QuizResultsPage() {
  // Results are displayed inline on the quiz page after finishing
  // This page serves as a fallback redirect
  return (
    <div className="max-w-xl mx-auto text-center py-12">
      <Card>
        <h2 className="text-xl font-bold text-text mb-3">کوئز مکمل!</h2>
        <p className="text-muted mb-6">
          نتائج دیکھنے کے لیے کوئز پیج پر جائیں
        </p>
        <Link href="/quiz">
          <Button>
            <ArrowRight className="h-4 w-4" />
            کوئز پیج پر واپس جائیں
          </Button>
        </Link>
      </Card>
    </div>
  );
}
