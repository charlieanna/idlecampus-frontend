-- Progressive Flow Migration 002: Challenge Tables
-- Creates challenge definitions and level structures

-- =====================================================
-- CHALLENGES TABLE (61 System Design Problems)
-- =====================================================
CREATE TABLE IF NOT EXISTS challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(100) UNIQUE NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  track_id UUID REFERENCES learning_tracks(id),
  order_in_track INTEGER,
  difficulty_base VARCHAR(20) NOT NULL CHECK (difficulty_base IN ('beginner', 'intermediate', 'advanced')),
  xp_base INTEGER DEFAULT 100,
  estimated_minutes INTEGER DEFAULT 30,
  prerequisites JSONB DEFAULT '[]',
  ddia_concepts JSONB DEFAULT '[]',
  tags JSONB DEFAULT '[]',
  metadata JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_challenges_track ON challenges(track_id);
CREATE INDEX IF NOT EXISTS idx_challenges_category ON challenges(category);
CREATE INDEX IF NOT EXISTS idx_challenges_slug ON challenges(slug);
CREATE INDEX IF NOT EXISTS idx_challenges_prerequisites ON challenges USING GIN (prerequisites);
CREATE INDEX IF NOT EXISTS idx_challenges_tags ON challenges USING GIN (tags);
CREATE INDEX IF NOT EXISTS idx_challenges_ddia ON challenges USING GIN (ddia_concepts);

-- =====================================================
-- CHALLENGE LEVELS TABLE (5 per challenge)
-- =====================================================
CREATE TABLE IF NOT EXISTS challenge_levels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
  level_number INTEGER NOT NULL CHECK (level_number BETWEEN 1 AND 5),
  level_name VARCHAR(100) NOT NULL,
  description TEXT,
  requirements JSONB NOT NULL,
  test_cases JSONB NOT NULL,
  passing_criteria JSONB NOT NULL,
  xp_reward INTEGER NOT NULL,
  hints JSONB DEFAULT '[]',
  solution_approach TEXT,
  estimated_minutes INTEGER DEFAULT 15,
  UNIQUE(challenge_id, level_number)
);

CREATE INDEX IF NOT EXISTS idx_challenge_levels_challenge ON challenge_levels(challenge_id);
CREATE INDEX IF NOT EXISTS idx_challenge_levels_number ON challenge_levels(level_number);
CREATE INDEX IF NOT EXISTS idx_challenge_requirements ON challenge_levels USING GIN (requirements);

-- =====================================================
-- DAILY CHALLENGES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS daily_challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
  date DATE UNIQUE NOT NULL,
  difficulty_modifier DECIMAL(3,2) DEFAULT 1.0,
  xp_multiplier DECIMAL(3,2) DEFAULT 2.0,
  special_requirements JSONB DEFAULT '{}',
  participants_count INTEGER DEFAULT 0,
  average_score DECIMAL(5,2),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_daily_challenges_date ON daily_challenges(date);

-- =====================================================
-- DAILY CHALLENGE ATTEMPTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS daily_challenge_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  daily_challenge_id UUID REFERENCES daily_challenges(id) ON DELETE CASCADE,
  score DECIMAL(5,2) NOT NULL,
  xp_earned INTEGER DEFAULT 0,
  rank INTEGER,
  completed_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, daily_challenge_id)
);

CREATE INDEX IF NOT EXISTS idx_daily_attempts_user ON daily_challenge_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_attempts_challenge ON daily_challenge_attempts(daily_challenge_id);

-- =====================================================
-- DATABASE FUNCTIONS
-- =====================================================

-- Function to check if challenge prerequisites are met
CREATE OR REPLACE FUNCTION check_challenge_prerequisites(
  p_user_id UUID,
  p_challenge_id UUID
) RETURNS BOOLEAN AS $$
DECLARE
  v_prerequisites JSONB;
  v_prereq_id TEXT;
  v_all_met BOOLEAN := true;
BEGIN
  -- Get prerequisites for the challenge
  SELECT prerequisites INTO v_prerequisites
  FROM challenges
  WHERE id = p_challenge_id;
  
  -- If no prerequisites, return true
  IF v_prerequisites IS NULL OR jsonb_array_length(v_prerequisites) = 0 THEN
    RETURN true;
  END IF;
  
  -- Check each prerequisite
  FOR v_prereq_id IN SELECT jsonb_array_elements_text(v_prerequisites)
  LOOP
    -- Check if user has completed this prerequisite
    IF NOT EXISTS (
      SELECT 1 
      FROM user_challenge_progress ucp
      JOIN challenges c ON c.id = ucp.challenge_id
      WHERE ucp.user_id = p_user_id
      AND c.slug = v_prereq_id
      AND ucp.status = 'completed'
    ) THEN
      v_all_met := false;
      EXIT;
    END IF;
  END LOOP;
  
  RETURN v_all_met;
END;
$$ LANGUAGE plpgsql;

-- Function to unlock challenges when prerequisites are met
CREATE OR REPLACE FUNCTION check_and_unlock_challenges(p_user_id UUID)
RETURNS TABLE(newly_unlocked UUID[]) AS $$
DECLARE
  v_newly_unlocked UUID[];
BEGIN
  -- Find challenges where all prerequisites are met
  WITH unlockable AS (
    SELECT c.id
    FROM challenges c
    WHERE c.is_active = true
    AND check_challenge_prerequisites(p_user_id, c.id) = true
    AND NOT EXISTS (
      SELECT 1
      FROM user_challenge_progress ucp
      WHERE ucp.user_id = p_user_id
      AND ucp.challenge_id = c.id
      AND ucp.unlock_date IS NOT NULL
    )
  )
  INSERT INTO user_challenge_progress (user_id, challenge_id, unlock_date, status)
  SELECT p_user_id, id, NOW(), 'not_started'
  FROM unlockable
  ON CONFLICT (user_id, challenge_id) 
  DO UPDATE SET unlock_date = EXCLUDED.unlock_date
  RETURNING challenge_id INTO v_newly_unlocked;
  
  RETURN QUERY SELECT v_newly_unlocked;
END;
$$ LANGUAGE plpgsql;

-- Trigger to unlock challenges after completing a challenge
CREATE OR REPLACE FUNCTION trigger_unlock_challenges()
RETURNS TRIGGER AS $$
BEGIN
  -- When a challenge is completed, check for new unlocks
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    PERFORM check_and_unlock_challenges(NEW.user_id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_unlock_on_completion
AFTER INSERT OR UPDATE ON user_challenge_progress
FOR EACH ROW
EXECUTE FUNCTION trigger_unlock_challenges();

-- =====================================================
-- ROLLBACK
-- =====================================================
-- To rollback this migration, run:
-- DROP TRIGGER IF EXISTS trigger_unlock_on_completion ON user_challenge_progress;
-- DROP FUNCTION IF EXISTS trigger_unlock_challenges();
-- DROP FUNCTION IF EXISTS check_and_unlock_challenges(UUID);
-- DROP FUNCTION IF EXISTS check_challenge_prerequisites(UUID, UUID);
-- DROP TABLE IF EXISTS daily_challenge_attempts CASCADE;
-- DROP TABLE IF EXISTS daily_challenges CASCADE;
-- DROP TABLE IF EXISTS challenge_levels CASCADE;
-- DROP TABLE IF EXISTS challenges CASCADE;