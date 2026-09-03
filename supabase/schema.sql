-- ==========================================
-- MedAce AI — Database Schema & Vector Search
-- ==========================================

-- 1. Enable Required PostgreSQL Extensions
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Profiles Table (User Metadata & Performance Stats)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  current_streak INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  last_active_date DATE,
  target_exam_date DATE,
  total_questions INT DEFAULT 0,
  total_sessions INT DEFAULT 0,
  overall_accuracy FLOAT DEFAULT 0.0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Textbook Chunks Table (RAG Embeddings Vector Store)
CREATE TABLE IF NOT EXISTS public.textbook_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter TEXT NOT NULL,
  chapter_num INT NOT NULL,
  chunk_index INT NOT NULL,
  content TEXT NOT NULL,
  token_count INT,
  embedding vector(768),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- HNSW Vector Index for Fast Cosine Similarity Search
CREATE INDEX IF NOT EXISTS textbook_chunks_embedding_hnsw_idx 
ON public.textbook_chunks 
USING hnsw (embedding vector_cosine_ops);

CREATE INDEX IF NOT EXISTS textbook_chunks_chapter_num_idx 
ON public.textbook_chunks (chapter_num);

-- 4. Quiz Sessions Table
CREATE TABLE IF NOT EXISTS public.quiz_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  topic TEXT NOT NULL,
  chapter_num INT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard', 'Mixed')),
  num_questions INT NOT NULL,
  score INT DEFAULT NULL,
  total_questions INT NOT NULL,
  status TEXT NOT NULL DEFAULT 'in-progress' CHECK (status IN ('in-progress', 'completed')),
  time_taken_ms INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS quiz_sessions_user_id_idx ON public.quiz_sessions (user_id);

-- 5. Quiz Questions Table
CREATE TABLE IF NOT EXISTS public.quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.quiz_sessions(id) ON DELETE CASCADE NOT NULL,
  question_text TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  correct_answer TEXT NOT NULL CHECK (correct_answer IN ('A', 'B', 'C', 'D')),
  explanation_en TEXT NOT NULL,
  explanation_ur TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  topic TEXT NOT NULL,
  chapter_num INT,
  chunk_ids UUID[] DEFAULT ARRAY[]::UUID[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS quiz_questions_session_id_idx ON public.quiz_questions (session_id);

-- 6. User Responses Table
CREATE TABLE IF NOT EXISTS public.user_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.quiz_sessions(id) ON DELETE CASCADE NOT NULL,
  question_id UUID REFERENCES public.quiz_questions(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  selected_answer TEXT CHECK (selected_answer IN ('A', 'B', 'C', 'D') OR selected_answer IS NULL),
  is_correct BOOLEAN NOT NULL,
  time_taken_ms INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS user_responses_user_id_idx ON public.user_responses (user_id);
CREATE INDEX IF NOT EXISTS user_responses_session_id_idx ON public.user_responses (session_id);

-- 7. Study Plans Table
CREATE TABLE IF NOT EXISTS public.study_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  target_exam_date DATE,
  week_number INT DEFAULT 1,
  plan_data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS study_plans_user_id_idx ON public.study_plans (user_id);

-- ==========================================
-- RPC Vector Similarity Search Function
-- ==========================================
CREATE OR REPLACE FUNCTION public.match_chunks(
  query_embedding vector(768),
  match_threshold FLOAT DEFAULT 0.0,
  match_count INT DEFAULT 5,
  filter_chapter TEXT DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  chapter TEXT,
  chapter_num INT,
  chunk_index INT,
  content TEXT,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    tc.id,
    tc.chapter,
    tc.chapter_num,
    tc.chunk_index,
    tc.content,
    (1 - (tc.embedding <=> query_embedding))::FLOAT AS similarity
  FROM public.textbook_chunks tc
  WHERE (filter_chapter IS NULL 
         OR filter_chapter = '' 
         OR tc.chapter ILIKE '%' || filter_chapter || '%' 
         OR tc.chapter_num::TEXT = filter_chapter)
    AND 1 - (tc.embedding <=> query_embedding) > match_threshold
  ORDER BY tc.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- ==========================================
-- Row Level Security (RLS) Policies
-- ==========================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.textbook_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_plans ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read & update their own profile
CREATE POLICY "Users can view own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Textbook Chunks: Public/Authenticated users can read chunks for RAG
CREATE POLICY "Anyone can read textbook chunks" 
  ON public.textbook_chunks FOR SELECT 
  TO authenticated, anon 
  USING (true);

-- Quiz Sessions: Users can manage their own quiz sessions
CREATE POLICY "Users can view own quiz sessions" 
  ON public.quiz_sessions FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own quiz sessions" 
  ON public.quiz_sessions FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own quiz sessions" 
  ON public.quiz_sessions FOR UPDATE 
  USING (auth.uid() = user_id);

-- Quiz Questions: Users can view questions belonging to their sessions
CREATE POLICY "Users can view quiz questions for their sessions" 
  ON public.quiz_questions FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.quiz_sessions s 
      WHERE s.id = quiz_questions.session_id AND s.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert quiz questions into their sessions" 
  ON public.quiz_questions FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.quiz_sessions s 
      WHERE s.id = quiz_questions.session_id AND s.user_id = auth.uid()
    )
  );

-- User Responses: Users can view & insert their own responses
CREATE POLICY "Users can view own responses" 
  ON public.user_responses FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can record own responses" 
  ON public.user_responses FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Study Plans: Users can view & manage their own study plans
CREATE POLICY "Users can view own study plans" 
  ON public.study_plans FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own study plans" 
  ON public.study_plans FOR ALL 
  USING (auth.uid() = user_id);

-- Trigger for New User Signup Profile Creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    new.email
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
