import { Badge } from "@/components/ui";
import { AlertTriangle } from "lucide-react";

interface WeakTopicAlertProps {
  topics: string[];
}

export function WeakTopicAlert({ topics }: WeakTopicAlertProps) {
  if (topics.length === 0) return null;

  return (
    <div className="flex items-start gap-3 rounded-xl bg-amber-50 border border-amber-200 p-4">
      <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
      <div>
        <p className="text-sm font-medium text-amber-800 mb-2">
          نئے کمزور موضوعات کی نشاندہی ہوئی:
        </p>
        <div className="flex flex-wrap gap-2">
          {topics.map((topic) => (
            <Badge key={topic} variant="warning">
              {topic}
            </Badge>
          ))}
        </div>
        <p className="text-xs text-amber-600 mt-2">
          اگلے کوئز میں ان موضوعات پر زیادہ توجہ دی جائے گی
        </p>
      </div>
    </div>
  );
}
