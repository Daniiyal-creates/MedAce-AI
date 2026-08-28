import {
  pgTable,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  authId: text("auth_id").notNull().unique(), // Supabase auth user ID
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const quizSessions = pgTable("quiz_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => users.authId),
  topic: text("topic").notNull(),
  questionCount: integer("question_count").notNull(),
  score: integer("score").notNull().default(0),
  accuracy: integer("accuracy").notNull().default(0),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

export const questions = pgTable("questions", {
  id: uuid("id").primaryKey().defaultRandom(),
  sessionId: uuid("session_id")
    .notNull()
    .references(() => quizSessions.id),
  questionText: text("question_text").notNull(),
  options: jsonb("options").notNull().$type<string[]>(),
  correctAnswer: integer("correct_answer").notNull(),
  explanation: text("explanation").notNull(),
  topic: text("topic").notNull(),
  difficulty: text("difficulty").notNull().default("medium"),
});

export const userAnswers = pgTable("user_answers", {
  id: uuid("id").primaryKey().defaultRandom(),
  sessionId: uuid("session_id")
    .notNull()
    .references(() => quizSessions.id),
  questionId: uuid("question_id")
    .notNull()
    .references(() => questions.id),
  selectedAnswer: integer("selected_answer").notNull(),
  isCorrect: boolean("is_correct").notNull(),
  timeTaken: integer("time_taken").notNull(),
});

export const weakTopics = pgTable("weak_topics", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => users.authId),
  topic: text("topic").notNull(),
  wrongCount: integer("wrong_count").notNull().default(0),
  totalCount: integer("total_count").notNull().default(0),
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
});

export const studyPlans = pgTable("study_plans", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => users.authId),
  weekStart: text("week_start").notNull(),
  planData: jsonb("plan_data").notNull(),
  generatedAt: timestamp("generated_at").defaultNow().notNull(),
});
