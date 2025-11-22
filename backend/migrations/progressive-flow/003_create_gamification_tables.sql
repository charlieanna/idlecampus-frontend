-- Progressive Flow Migration 003: Gamification Tables
-- Creates XP, achievements, badges, and skill tree tables

-- =====================================================
-- XP TRANSACTIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS xp_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  source_type VARCHAR(50) NOT NULL,
  source_id VARCHAR(255),
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_xp_transactions_user ON xp_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_xp_transactions_created ON xp_transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_xp_transactions_user_date ON xp_transactions(user_id, created_at DESC);

-- =====================================================
-- ACHIEVEMENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  icon_url TEXT,
  category VARCHAR(50),
  rarity VARCHAR(20) DEFAULT 'common' CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
  xp_reward INTEGER DEFAULT 0,
  criteria JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_achievements_category ON achievements(category);
CREATE INDEX IF NOT EXISTS idx_achievements_rarity ON achievements(rarity);
CREATE INDEX IF NOT EXISTS idx_achievements_slug ON achievements(slug);

-- =====================================================
-- USER ACHIEVEMENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP DEFAULT NOW(),
  progress DECIMAL(5,2) DEFAULT 100.00,
  metadata JSONB DEFAULT '{}',
  UNIQUE(user_id, achievement_id)
);

CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_unlocked ON user_achievements(unlocked_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_achievements_progress ON user_achievements(user_id, achievement_id, progress);

-- =====================================================
-- SKILLS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  category VARCHAR(50),
  parent_skill_id UUID REFERENCES skills(id),
  prerequisites JSONB DEFAULT '[]',
  max_level INTEGER DEFAULT 5,
  xp_per_level INTEGER DEFAULT 100,
  icon_url TEXT,
  metadata JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category);
CREATE INDEX IF NOT EXISTS idx_skills_parent ON skills(parent_skill_id);
CREATE INDEX IF NOT EXISTS idx_skills_slug ON skills(slug);

-- =====================================================
-- USER SKILLS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS user_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
  current_level INTEGER DEFAULT 0,
  points_allocated INTEGER DEFAULT 0,
  unlocked_at TIMESTAMP,
  mastered_at TIMESTAMP,
  metadata JSONB DEFAULT '{}',
  UNIQUE(user_id, skill_id)
);

CREATE INDEX IF NOT EXISTS idx_user_skills_user ON user_skills(user_id);
CREATE INDEX IF NOT EXISTS idx_user_skills_skill ON user_skills(skill_id);
CREATE INDEX IF NOT EXISTS idx_user_skills_level ON user_skills(current_level DESC);

-- =====================================================
-- DATABASE FUNCTIONS
-- =====================================================

-- Function to calculate user level from total XP
-- Using formula: level = floor((-1 + sqrt(1 + 8*xp/100)) / 2) + 1
CREATE OR REPLACE FUNCTION calculate_level_from_xp(total_xp INTEGER)
RETURNS INTEGER AS $$
BEGIN
  -- XP required = 100 * level * (level + 1) / 2
  -- Solving for level: level = floor((-1 + sqrt(1 + 8*xp/100)) / 2)
  RETURN FLOOR((-1 + SQRT(1 + 8 * total_xp::NUMERIC / 100)) / 2) + 1;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to get XP required for a specific level
CREATE OR REPLACE FUNCTION get_xp_for_level(level INTEGER)
RETURNS INTEGER AS $$
BEGIN
  RETURN 100 * level * (level + 1) / 2;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to update user stats when XP is earned
CREATE OR REPLACE FUNCTION update_user_stats_on_xp()
RETURNS TRIGGER AS $$
DECLARE
  v_new_total_xp INTEGER;
  v_new_level INTEGER;
BEGIN
  -- Calculate new total XP
  SELECT COALESCE(SUM(amount), 0) INTO v_new_total_xp
  FROM xp_transactions
  WHERE user_id = NEW.user_id;
  
  -- Calculate new level
  v_new_level := calculate_level_from_xp(v_new_total_xp);
  
  -- Update user stats
  UPDATE user_stats 
  SET 
    total_xp = v_new_total_xp,
    current_level = v_new_level,
    updated_at = NOW()
  WHERE user_id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_stats_on_xp
AFTER INSERT ON xp_transactions
FOR EACH ROW
EXECUTE FUNCTION update_user_stats_on_xp();

-- Function to calculate streak
CREATE OR REPLACE FUNCTION calculate_user_streak(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_streak INTEGER := 0;
  v_last_date DATE;
  v_current_date DATE;
BEGIN
  -- Get dates of activity (from level attempts)
  FOR v_current_date IN 
    SELECT DISTINCT DATE(created_at) as activity_date
    FROM level_attempts
    WHERE user_id = p_user_id
    ORDER BY activity_date DESC
  LOOP
    IF v_last_date IS NULL OR v_last_date = v_current_date + INTERVAL '1 day' THEN
      v_streak := v_streak + 1;
      v_last_date := v_current_date;
    ELSE
      EXIT;
    END IF;
  END LOOP;
  
  RETURN v_streak;
END;
$$ LANGUAGE plpgsql;

-- Function to update streak on activity
CREATE OR REPLACE FUNCTION update_user_streak()
RETURNS TRIGGER AS $$
DECLARE
  v_current_streak INTEGER;
  v_activity_date DATE;
BEGIN
  v_activity_date := DATE(NEW.created_at);
  v_current_streak := calculate_user_streak(NEW.user_id);
  
  -- Update user stats
  UPDATE user_stats
  SET 
    current_streak_days = v_current_streak,
    longest_streak_days = GREATEST(longest_streak_days, v_current_streak),
    last_activity_date = v_activity_date,
    updated_at = NOW()
  WHERE user_id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_streak_on_attempt
AFTER INSERT ON level_attempts
FOR EACH ROW
EXECUTE FUNCTION update_user_streak();

-- Function to check and award achievements
CREATE OR REPLACE FUNCTION check_and_award_achievements(p_user_id UUID)
RETURNS TABLE(newly_awarded UUID[]) AS $$
DECLARE
  v_achievement RECORD;
  v_user_stats RECORD;
  v_newly_awarded UUID[] := ARRAY[]::UUID[];
  v_criteria_met BOOLEAN;
BEGIN
  -- Get user stats
  SELECT * INTO v_user_stats
  FROM user_stats us
  WHERE us.user_id = p_user_id;
  
  -- Check each achievement
  FOR v_achievement IN 
    SELECT a.* 
    FROM achievements a
    WHERE a.is_active = true
    AND NOT EXISTS (
      SELECT 1 FROM user_achievements ua
      WHERE ua.user_id = p_user_id
      AND ua.achievement_id = a.id
    )
  LOOP
    v_criteria_met := false;
    
    -- Simple criteria checking (can be extended)
    -- Check for challenges completed milestone
    IF v_achievement.criteria->>'type' = 'challenges_completed' THEN
      IF v_user_stats.total_challenges_completed >= 
         (v_achievement.criteria->>'count')::INTEGER THEN
        v_criteria_met := true;
      END IF;
    END IF;
    
    -- Check for streak milestone
    IF v_achievement.criteria->>'type' = 'streak_days' THEN
      IF v_user_stats.current_streak_days >= 
         (v_achievement.criteria->>'days')::INTEGER THEN
        v_criteria_met := true;
      END IF;
    END IF;
    
    -- Check for XP milestone
    IF v_achievement.criteria->>'type' = 'total_xp' THEN
      IF v_user_stats.total_xp >= 
         (v_achievement.criteria->>'amount')::INTEGER THEN
        v_criteria_met := true;
      END IF;
    END IF;
    
    -- Award achievement if criteria met
    IF v_criteria_met THEN
      INSERT INTO user_achievements (user_id, achievement_id, unlocked_at)
      VALUES (p_user_id, v_achievement.id, NOW())
      ON CONFLICT (user_id, achievement_id) DO NOTHING;
      
      -- Award XP for achievement
      IF v_achievement.xp_reward > 0 THEN
        INSERT INTO xp_transactions (user_id, amount, source_type, source_id, description)
        VALUES (
          p_user_id,
          v_achievement.xp_reward,
          'achievement',
          v_achievement.id::TEXT,
          'Achievement unlocked: ' || v_achievement.name
        );
      END IF;
      
      v_newly_awarded := array_append(v_newly_awarded, v_achievement.id);
    END IF;
  END LOOP;
  
  RETURN QUERY SELECT v_newly_awarded;
END;
$$ LANGUAGE plpgsql;

-- Trigger to check achievements after completing a level
CREATE OR REPLACE FUNCTION trigger_check_achievements()
RETURNS TRIGGER AS $$
BEGIN
  -- Check achievements after a successful level completion
  IF NEW.passed = true THEN
    PERFORM check_and_award_achievements(NEW.user_id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_check_achievements_on_level_complete
AFTER INSERT ON level_attempts
FOR EACH ROW
EXECUTE FUNCTION trigger_check_achievements();

-- Function to allocate skill point
CREATE OR REPLACE FUNCTION allocate_skill_point(
  p_user_id UUID,
  p_skill_id UUID
) RETURNS JSONB AS $$
DECLARE
  v_skill RECORD;
  v_user_skill RECORD;
  v_available_points INTEGER;
  v_current_level INTEGER;
BEGIN
  -- Get skill info
  SELECT * INTO v_skill FROM skills WHERE id = p_skill_id;
  IF v_skill IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Skill not found');
  END IF;
  
  -- Calculate available skill points (1 per 5 levels + bonus every 10)
  SELECT current_level INTO v_available_points FROM user_stats WHERE user_id = p_user_id;
  v_available_points := FLOOR(v_available_points / 5) + FLOOR(v_available_points / 10);
  
  -- Get currently allocated points
  SELECT COALESCE(SUM(points_allocated), 0) INTO v_current_level
  FROM user_skills
  WHERE user_id = p_user_id;
  
  IF v_current_level >= v_available_points THEN
    RETURN jsonb_build_object('success', false, 'error', 'No skill points available');
  END IF;
  
  -- Get or create user skill record
  INSERT INTO user_skills (user_id, skill_id, current_level, points_allocated, unlocked_at)
  VALUES (p_user_id, p_skill_id, 0, 0, NOW())
  ON CONFLICT (user_id, skill_id) DO NOTHING;
  
  SELECT * INTO v_user_skill FROM user_skills 
  WHERE user_id = p_user_id AND skill_id = p_skill_id;
  
  -- Check max level
  IF v_user_skill.current_level >= v_skill.max_level THEN
    RETURN jsonb_build_object('success', false, 'error', 'Skill at max level');
  END IF;
  
  -- Allocate point
  UPDATE user_skills
  SET 
    current_level = current_level + 1,
    points_allocated = points_allocated + 1,
    mastered_at = CASE WHEN current_level + 1 >= v_skill.max_level THEN NOW() ELSE mastered_at END
  WHERE user_id = p_user_id AND skill_id = p_skill_id;
  
  RETURN jsonb_build_object(
    'success', true,
    'newLevel', v_user_skill.current_level + 1,
    'remainingPoints', v_available_points - v_current_level - 1
  );
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- ROLLBACK
-- =====================================================
-- To rollback this migration, run:
-- DROP TRIGGER IF EXISTS trigger_check_achievements_on_level_complete ON level_attempts;
-- DROP TRIGGER IF EXISTS trigger_update_streak_on_attempt ON level_attempts;
-- DROP TRIGGER IF EXISTS trigger_update_stats_on_xp ON xp_transactions;
-- DROP FUNCTION IF EXISTS allocate_skill_point(UUID, UUID);
-- DROP FUNCTION IF EXISTS trigger_check_achievements();
-- DROP FUNCTION IF EXISTS check_and_award_achievements(UUID);
-- DROP FUNCTION IF EXISTS update_user_streak();
-- DROP FUNCTION IF EXISTS calculate_user_streak(UUID);
-- DROP FUNCTION IF EXISTS update_user_stats_on_xp();
-- DROP FUNCTION IF EXISTS get_xp_for_level(INTEGER);
-- DROP FUNCTION IF EXISTS calculate_level_from_xp(INTEGER);
-- DROP TABLE IF EXISTS user_skills CASCADE;
-- DROP TABLE IF EXISTS skills CASCADE;
-- DROP TABLE IF EXISTS user_achievements CASCADE;
-- DROP TABLE IF EXISTS achievements CASCADE;
-- DROP TABLE IF EXISTS xp_transactions CASCADE;