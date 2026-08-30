"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { cn } from "@/lib/utils";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  toast: (type: ToastType, message: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

const icons: Record<ToastType, ReactNode> = {
  success: <CheckCircle className="h-5 w-5 text-success" />,
  error: <AlertCircle className="h-5 w-5 text-error" />,
  info: <Info className="h-5 w-5 text-info" />,
};

const borderColors: Record<ToastType, string> = {
  success: "border-success/30",
  error: "border-error/30",
  info: "border-info/30",
};

function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const toast = useCallback((type: ToastType, message: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismiss = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "flex items-center gap-3 rounded-lg bg-surface border px-4 py-3 shadow-lg shadow-black/30 animate-slide-up min-w-[280px] max-w-[400px]",
              borderColors[t.type]
            )}
          >
            {icons[t.type]}
            <p className="flex-1 text-sm text-text">{t.message}</p>
            <button
              onClick={() => dismiss(t.id)}
              className="text-muted hover:text-text transition-colors cursor-pointer"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export { ToastProvider };
