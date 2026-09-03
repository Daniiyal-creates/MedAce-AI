import { z } from "zod";

export const QuizGenerateSchema = z.object({
  chapter: z.union([z.string(), z.number()]),
  topic: z.string().min(1, "Topic is required"),
  difficulty: z.enum(["Easy", "Medium", "Hard", "Mixed"]).default("Mixed"),
  count: z.number().int().min(1).max(100).default(20),
});

export type QuizGenerateInput = z.infer<typeof QuizGenerateSchema>;

export const QuizAnswerSubmissionSchema = z.object({
  questionId: z.string().min(1, "Question ID is required"),
  selectedAnswer: z.enum(["A", "B", "C", "D"]).nullable(),
  isCorrect: z.boolean().default(false),
  timeTakenMs: z.number().min(0).default(0),
});

export const QuizSubmitSchema = z.object({
  sessionId: z.string().min(1, "Session ID is required"),
  answers: z.array(QuizAnswerSubmissionSchema),
  timeTakenMs: z.number().min(0).optional(),
});

export type QuizSubmitInput = z.infer<typeof QuizSubmitSchema>;

export const QuizExplainSchema = z.object({
  questionId: z.string().optional(),
  questionText: z.string().min(1, "Question text is required"),
  options: z.object({
    A: z.string().min(1),
    B: z.string().min(1),
    C: z.string().min(1),
    D: z.string().min(1),
  }),
  correctAnswer: z.enum(["A", "B", "C", "D"]),
  topic: z.string().optional(),
});

export type QuizExplainInput = z.infer<typeof QuizExplainSchema>;

export const StudyPlanGenerateSchema = z.object({
  targetExamDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be formatted as YYYY-MM-DD"),
  weakTopics: z.array(z.string()).optional(),
});

export type StudyPlanGenerateInput = z.infer<typeof StudyPlanGenerateSchema>;
