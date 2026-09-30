CREATE TABLE IF NOT EXISTS quizzes (
  id                 SERIAL PRIMARY KEY,
  slug               TEXT UNIQUE NOT NULL,
  title              TEXT NOT NULL,
  description        TEXT NOT NULL,
  category           TEXT NOT NULL,
  difficulty         TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  estimated_minutes  INT  NOT NULL DEFAULT 5,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS questions (
  id             SERIAL PRIMARY KEY,
  quiz_id        INT  NOT NULL REFERENCES quizzes (id) ON DELETE CASCADE,
  prompt         TEXT NOT NULL,
  options        JSONB NOT NULL,
  correct_index  INT  NOT NULL,
  explanation    TEXT NOT NULL DEFAULT '',
  position       INT  NOT NULL,
  UNIQUE (quiz_id, position)
);

CREATE TABLE IF NOT EXISTS attempts (
  id                SERIAL PRIMARY KEY,
  quiz_id           INT  NOT NULL REFERENCES quizzes (id) ON DELETE CASCADE,
  player_name       TEXT NOT NULL,
  score             INT  NOT NULL,
  total             INT  NOT NULL,
  duration_seconds  INT  NOT NULL DEFAULT 0,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_questions_quiz   ON questions (quiz_id);
CREATE INDEX IF NOT EXISTS idx_attempts_quiz    ON attempts (quiz_id);
CREATE INDEX IF NOT EXISTS idx_attempts_score   ON attempts (quiz_id, score DESC);
