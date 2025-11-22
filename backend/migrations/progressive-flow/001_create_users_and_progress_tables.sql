-- Progressive Flow Migration 001: Users and Progress Tables
-- Creates core user tables and user-challenge progress tracking

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- USERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  display_name VARCHAR(200),
  avatar_url TEXT,
  skill_level VARCHAR(20) DEFAULT 'beginner' CHECK (skill_level IN ('beginner', 'intermediate', 'advanced')),
  onboarding_completed BOOLEAN DEFAULT false,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_active_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for users
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_last_active ON users(last_active_at);

-- =====================================================
-- USER STATS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS user_stats (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  total_xp INTEGER DEFAULT 0,
  current_level INTEGER DEFAULT 1,
  total_challenges_started INTEGER DEFAULT 0,
  total_challenges_completed INTEGER DEFAULT 0,
  total_levels_completed INTEGER DEFAULT 0,
  total_time_spent_minutes INTEGER DEFAULT 0,
  current_streak_days INTEGER DEFAULT 0,
  longest_streak_days INTEGER DEFAULT 0,
  last_activity_date DATE,
  rank_percentile DECIMAL(5,2),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for user stats (for leaderboard queries)
CREATE INDEX IF NOT EXISTS idx_user_stats_xp ON user_stats(total_xp DESC);
CREATE INDEX IF NOT EXISTS idx_user_stats_level ON user_stats(current_level DESC);
CREATE INDEX IF NOT EXISTS idx_user_stats_streak ON user_stats(current_streak_days DESC);

-- =====================================================
-- LEARNING TRACKS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS learning_tracks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(100) UNIQUE NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  difficulty_level VARCHAR(20) NOT NULL CHECK (difficulty_level IN ('fundamentals', 'concepts', 'systems')),
  estimated_hours INTEGER,
  prerequisites JSONB DEFAULT '[]',
  order_index INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tracks_difficulty ON learning_tracks(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_tracks_order ON learning_tracks(order_index);

-- =====================================================
-- USER TRACK PROGRESS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS user_track_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  track_id UUID REFERENCES learning_tracks(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  progress_percentage DECIMAL(5,2) DEFAULT 0.00,
  challenges_completed INTEGER DEFAULT 0,
  total_challenges INTEGER NOT NULL,
  unlock_date TIMESTAMP,
  start_date TIMESTAMP,
  completion_date TIMESTAMP,
  UNIQUE(user_id, track_id)
);

CREATE INDEX IF NOT EXISTS idx_track_progress_user ON user_track_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_track_progress_track ON user_track_progress(track_id);

-- =====================================================
-- USER CHALLENGE PROGRESS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS user_challenge_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  challenge_id UUID NOT NULL,
  status VARCHAR(20) DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  current_level INTEGER DEFAULT 0,
  levels_completed INTEGER[] DEFAULT ARRAY[]::INTEGER[],
  unlock_date TIMESTAMP,
  start_date TIMESTAMP,
  completion_date TIMESTAMP,
  total_attempts INTEGER DEFAULT 0,
  total_time_spent_minutes INTEGER DEFAULT 0,
  best_score DECIMAL(5,2),
  xp_earned INTEGER DEFAULT 0,
  UNIQUE(user_id, challenge_id)
);

CREATE INDEX IF NOT EXISTS idx_user_progress_user ON user_challenge_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_challenge ON user_challenge_progress(challenge_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_status ON user_challenge_progress(status);

-- =====================================================
-- LEVEL ATTEMPTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS level_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  challenge_id UUID NOT NULL,
  level_number INTEGER NOT NULL CHECK (level_number BETWEEN 1 AND 5),
  attempt_number INTEGER NOT NULL,
  design_snapshot JSONB NOT NULL,
  test_results JSONB NOT NULL,
  score DECIMAL(5,2) NOT NULL,
  passed BOOLEAN NOT NULL,
  xp_earned INTEGER DEFAULT 0,
  hints_used INTEGER DEFAULT 0,
  time_spent_minutes INTEGER,
  feedback JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_attempts_user ON level_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_attempts_challenge_level ON level_attempts(challenge_id, level_number);
CREATE INDEX IF NOT EXISTS idx_attempts_created ON level_attempts(created_at DESC);

-- =====================================================
-- ASSESSMENT RESULTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS assessment_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  assessment_type VARCHAR(50) NOT NULL,
  questions JSONB NOT NULL,
  responses JSONB NOT NULL,
  score DECIMAL(5,2) NOT NULL,
  skill_level_recommendation VARCHAR(50),
  track_recommendations JSONB DEFAULT '[]',
  challenge_recommendations JSONB DEFAULT '[]',
  strengths JSONB DEFAULT '[]',
  weaknesses JSONB DEFAULT '[]',
  completed_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_assessment_user ON assessment_results(user_id);
CREATE INDEX IF NOT EXISTS idx_assessment_completed ON assessment_results(completed_at DESC);

-- =====================================================
-- LEARNING SESSIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS learning_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  session_type VARCHAR(50) NOT NULL,
  resource_id VARCHAR(255),
  start_time TIMESTAMP DEFAULT NOW(),
  end_time TIMESTAMP,
  duration_minutes INTEGER,
  xp_earned INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_sessions_user ON learning_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_start ON learning_sessions(start_time DESC);

-- =====================================================
-- HINT USAGE TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS hint_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  challenge_id UUID NOT NULL,
  level_number INTEGER NOT NULL,
  hint_number INTEGER NOT NULL,
  xp_penalty INTEGER DEFAULT 0,
  used_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_hint_usage_user ON hint_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_hint_usage_challenge ON hint_usage(challenge_id, level_number);

-- =====================================================
-- NOTIFICATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(200) NOT NULL,
  message TEXT,
  action_url TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  read_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = false;
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at DESC);

-- =====================================================
-- TRIGGER: Auto-create user_stats on user creation
-- =====================================================
CREATE OR REPLACE FUNCTION create_user_stats()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_stats (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_create_user_stats
AFTER INSERT ON users
FOR EACH ROW
EXECUTE FUNCTION create_user_stats();

-- =====================================================
-- TRIGGER: Update user last_active_at on activity
-- =====================================================
CREATE OR REPLACE FUNCTION update_user_last_active()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE users
  SET last_active_at = NOW()
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_last_active_on_attempt
AFTER INSERT ON level_attempts
FOR EACH ROW
EXECUTE FUNCTION update_user_last_active();

-- =====================================================
-- ROLLBACK
-- =====================================================
-- To rollback this migration, run:
-- DROP TRIGGER IF EXISTS trigger_update_last_active_on_attempt ON level_attempts;
-- DROP TRIGGER IF EXISTS trigger_create_user_stats ON users;
-- DROP FUNCTION IF EXISTS update_user_last_active();
-- DROP FUNCTION IF EXISTS create_user_stats();
-- DROP TABLE IF EXISTS notifications CASCADE;
-- DROP TABLE IF EXISTS hint_usage CASCADE;
-- DROP TABLE IF EXISTS learning_sessions CASCADE;
-- DROP TABLE IF EXISTS assessment_results CASCADE;
-- DROP TABLE IF EXISTS level_attempts CASCADE;
-- DROP TABLE IF EXISTS user_challenge_progress CASCADE;
-- DROP TABLE IF EXISTS user_track_progress CASCADE;
-- DROP TABLE IF EXISTS learning_tracks CASCADE;
-- DROP TABLE IF EXISTS user_stats CASCADE;
-- DROP TABLE IF EXISTS users CASCADE;