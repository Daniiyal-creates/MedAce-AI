"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
}

export function Modal({ open, onClose, title, children, className }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [open]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      <dialog
        ref={dialogRef}
        className={cn(
          "fixed inset-0 z-50 m-auto w-full max-w-lg rounded-xl bg-surface p-6 shadow-xl",
          "border border-border",
          className
        )}
        onClose={onClose}
      >
        <div className="flex items-center justify-between mb-4">
          {title && <h2 className="text-xl font-bold text-text">{title}</h2>}
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted hover:text-text hover:bg-gray-100 transition-colors"
            aria-label="بند کریں"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </dialog>
    </>
  );
}
