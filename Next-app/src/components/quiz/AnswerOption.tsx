import { cn } from "@/lib/utils";

interface AnswerOptionProps {
  label: string;
  index: number;
  selected: boolean;
  correct: boolean;
  revealed: boolean;
  disabled: boolean;
  onSelect: (index: number) => void;
}

const optionLetters = ["الف", "ب", "ج", "د"];

export function AnswerOption({
  label,
  index,
  selected,
  correct,
  revealed,
  disabled,
  onSelect,
}: AnswerOptionProps) {
  let borderClass = "border-border hover:border-primary/50";
  let bgClass = "bg-surface";

  if (revealed) {
    if (correct) {
      borderClass = "border-success";
      bgClass = "bg-green-50";
    } else if (selected && !correct) {
      borderClass = "border-error";
      bgClass = "bg-red-50";
    }
  } else if (selected) {
    borderClass = "border-primary";
    bgClass = "bg-primary/5";
  }

  return (
    <button
      onClick={() => onSelect(index)}
      disabled={disabled}
      className={cn(
        "flex w-full items-center gap-4 rounded-xl border-2 px-5 py-4 text-right transition-all",
        borderClass,
        bgClass,
        !disabled && !revealed && "cursor-pointer hover:bg-gray-50",
        disabled && !revealed && "cursor-not-allowed opacity-60"
      )}
    >
      <span
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold",
          revealed && correct
            ? "bg-success text-white"
            : revealed && selected && !correct
              ? "bg-error text-white"
              : selected
                ? "bg-primary text-white"
                : "bg-gray-100 text-muted"
        )}
      >
        {optionLetters[index]}
      </span>
      <span className="flex-1 text-sm font-medium text-text">{label}</span>
    </button>
  );
}
