# Progressive Flow Database Schema

## Overview
This document defines the comprehensive database schema for the progressive flow system design course platform, supporting 61 challenges with 5 levels each, gamification, prerequisites, and adaptive learning paths.

## Core Entities

### 1. Users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  display_name VARCHAR(200),
  avatar_url TEXT,
  skill_level ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
  onboarding_completed BOOLEAN DEFAULT false,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_active_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_last_active ON users(last_active_at);
```

### 2. User Profile & Stats
```sql
CREATE TABLE user_stats (
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

-- Indexes for leaderboard queries
CREATE INDEX idx_user_stats_xp ON user_stats(total_xp DESC);
CREATE INDEX idx_user_stats_level ON user_stats(current_level DESC);
CREATE INDEX idx_user_stats_streak ON user_stats(current_streak_days DESC);
```

### 3. Learning Tracks
```sql
CREATE TABLE learning_tracks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(100) UNIQUE NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  difficulty_level ENUM('fundamentals', 'concepts', 'systems') NOT NULL,
  estimated_hours INTEGER,
  prerequisites JSONB DEFAULT '[]', -- Array of track IDs
  order_index INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_tracks_difficulty ON learning_tracks(difficulty_level);
CREATE INDEX idx_tracks_order ON learning_tracks(order_index);
```

### 4. Challenges (61 System Design Problems)
```sql
CREATE TABLE challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(100) UNIQUE NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  category VARCHAR(100), -- 'caching', 'messaging', 'storage', etc.
  track_id UUID REFERENCES learning_tracks(id),
  order_in_track INTEGER,
  difficulty_base ENUM('beginner', 'intermediate', 'advanced') NOT NULL,
  xp_base INTEGER DEFAULT 100,
  estimated_minutes INTEGER DEFAULT 30,
  prerequisites JSONB DEFAULT '[]', -- Array of challenge IDs
  ddia_concepts JSONB DEFAULT '[]', -- DDIA chapter/concept mapping
  tags JSONB DEFAULT '[]',
  metadata JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_challenges_track ON challenges(track_id);
CREATE INDEX idx_challenges_category ON challenges(category);
CREATE INDEX idx_challenges_slug ON challenges(slug);
```

### 5. Challenge Levels (5 per challenge)
```sql
CREATE TABLE challenge_levels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
  level_number INTEGER NOT NULL CHECK (level_number BETWEEN 1 AND 5),
  level_name VARCHAR(100) NOT NULL, -- 'Connectivity', 'Capacity', etc.
  description TEXT,
  requirements JSONB NOT NULL, -- Specific requirements for this level
  test_cases JSONB NOT NULL, -- Test scenarios
  passing_criteria JSONB NOT NULL, -- Pass/fail conditions
  xp_reward INTEGER NOT NULL,
  hints JSONB DEFAULT '[]',
  solution_approach TEXT,
  estimated_minutes INTEGER DEFAULT 15,
  UNIQUE(challenge_id, level_number)
);

CREATE INDEX idx_challenge_levels_challenge ON challenge_levels(challenge_id);
CREATE INDEX idx_challenge_levels_number ON challenge_levels(level_number);
```

### 6. User Progress Per Challenge
```sql
CREATE TABLE user_challenge_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
  status ENUM('not_started', 'in_progress', 'completed') DEFAULT 'not_started',
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

CREATE INDEX idx_user_progress_user ON user_challenge_progress(user_id);
CREATE INDEX idx_user_progress_challenge ON user_challenge_progress(challenge_id);
CREATE INDEX idx_user_progress_status ON user_challenge_progress(status);
```

### 7. Level Attempts
```sql
CREATE TABLE level_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
  level_number INTEGER NOT NULL,
  attempt_number INTEGER NOT NULL,
  design_snapshot JSONB NOT NULL, -- The user's system design
  test_results JSONB NOT NULL, -- Results from each test case
  score DECIMAL(5,2) NOT NULL,
  passed BOOLEAN NOT NULL,
  xp_earned INTEGER DEFAULT 0,
  hints_used INTEGER DEFAULT 0,
  time_spent_minutes INTEGER,
  feedback JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_attempts_user ON level_attempts(user_id);
CREATE INDEX idx_attempts_challenge_level ON level_attempts(challenge_id, level_number);
CREATE INDEX idx_attempts_created ON level_attempts(created_at DESC);
```

### 8. User Track Progress
```sql
CREATE TABLE user_track_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  track_id UUID REFERENCES learning_tracks(id) ON DELETE CASCADE,
  status ENUM('not_started', 'in_progress', 'completed') DEFAULT 'not_started',
  progress_percentage DECIMAL(5,2) DEFAULT 0.00,
  challenges_completed INTEGER DEFAULT 0,
  total_challenges INTEGER NOT NULL,
  unlock_date TIMESTAMP,
  start_date TIMESTAMP,
  completion_date TIMESTAMP,
  UNIQUE(user_id, track_id)
);

CREATE INDEX idx_track_progress_user ON user_track_progress(user_id);
CREATE INDEX idx_track_progress_track ON user_track_progress(track_id);
```

### 9. Achievements & Badges
```sql
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  icon_url TEXT,
  category VARCHAR(50), -- 'speed', 'mastery', 'streak', 'exploration'
  rarity ENUM('common', 'rare', 'epic', 'legendary') DEFAULT 'common',
  xp_reward INTEGER DEFAULT 0,
  criteria JSONB NOT NULL, -- Conditions to unlock
  is_active BOOLEAN DEFAULT true
);

CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP DEFAULT NOW(),
  progress DECIMAL(5,2) DEFAULT 100.00, -- For progressive achievements
  metadata JSONB DEFAULT '{}',
  UNIQUE(user_id, achievement_id)
);

CREATE INDEX idx_user_achievements_user ON user_achievements(user_id);
CREATE INDEX idx_user_achievements_unlocked ON user_achievements(unlocked_at DESC);
```

### 10. Skill Tree & Points
```sql
CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  category VARCHAR(50),
  parent_skill_id UUID REFERENCES skills(id),
  prerequisites JSONB DEFAULT '[]', -- Array of skill IDs
  max_level INTEGER DEFAULT 5,
  xp_per_level INTEGER DEFAULT 100
);

CREATE TABLE user_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
  current_level INTEGER DEFAULT 0,
  points_allocated INTEGER DEFAULT 0,
  unlocked_at TIMESTAMP,
  mastered_at TIMESTAMP,
  UNIQUE(user_id, skill_id)
);

CREATE INDEX idx_user_skills_user ON user_skills(user_id);
CREATE INDEX idx_user_skills_skill ON user_skills(skill_id);
```

### 11. XP Transactions
```sql
CREATE TABLE xp_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  source_type VARCHAR(50) NOT NULL, -- 'challenge', 'achievement', 'daily', 'streak'
  source_id VARCHAR(255),
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_xp_transactions_user ON xp_transactions(user_id);
CREATE INDEX idx_xp_transactions_created ON xp_transactions(created_at DESC);
```

### 12. Daily Challenges
```sql
CREATE TABLE daily_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
  date DATE UNIQUE NOT NULL,
  difficulty_modifier DECIMAL(3,2) DEFAULT 1.0,
  xp_multiplier DECIMAL(3,2) DEFAULT 2.0,
  special_requirements JSONB DEFAULT '{}',
  participants_count INTEGER DEFAULT 0,
  average_score DECIMAL(5,2),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_daily_challenges_date ON daily_challenges(date);

CREATE TABLE daily_challenge_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  daily_challenge_id UUID REFERENCES daily_challenges(id) ON DELETE CASCADE,
  score DECIMAL(5,2) NOT NULL,
  xp_earned INTEGER DEFAULT 0,
  rank INTEGER,
  completed_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, daily_challenge_id)
);
```

### 13. Leaderboards
```sql
CREATE TABLE leaderboard_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  period_type ENUM('daily', 'weekly', 'monthly', 'all_time') NOT NULL,
  period_date DATE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  metric_type VARCHAR(50) NOT NULL, -- 'xp', 'challenges', 'streak'
  metric_value INTEGER NOT NULL,
  rank INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(period_type, period_date, user_id, metric_type)
);

CREATE INDEX idx_leaderboard_period ON leaderboard_entries(period_type, period_date);
CREATE INDEX idx_leaderboard_rank ON leaderboard_entries(rank);
CREATE INDEX idx_leaderboard_user ON leaderboard_entries(user_id);
```

### 14. Assessment Results
```sql
CREATE TABLE assessment_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  assessment_type VARCHAR(50) NOT NULL, -- 'initial', 'track_placement', 'periodic'
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

CREATE INDEX idx_assessment_user ON assessment_results(user_id);
CREATE INDEX idx_assessment_completed ON assessment_results(completed_at DESC);
```

### 15. Learning Sessions
```sql
CREATE TABLE learning_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  session_type VARCHAR(50) NOT NULL, -- 'challenge', 'assessment', 'lesson'
  resource_id VARCHAR(255),
  start_time TIMESTAMP DEFAULT NOW(),
  end_time TIMESTAMP,
  duration_minutes INTEGER,
  xp_earned INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}
);

CREATE INDEX idx_sessions_user ON learning_sessions(user_id);
CREATE INDEX idx_sessions_start ON learning_sessions(start_time DESC);
```

### 16. Hint Usage
```sql
CREATE TABLE hint_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
  level_number INTEGER NOT NULL,
  hint_number INTEGER NOT NULL,
  xp_penalty INTEGER DEFAULT 0,
  used_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_hint_usage_user ON hint_usage(user_id);
CREATE INDEX idx_hint_usage_challenge ON hint_usage(challenge_id, level_number);
```

### 17. Notifications
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- 'achievement', 'level_complete', 'streak', 'challenge_unlock'
  title VARCHAR(200) NOT NULL,
  message TEXT,
  action_url TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  read_at TIMESTAMP
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = false;
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);
```

## Views for Common Queries

### User Dashboard View
```sql
CREATE VIEW user_dashboard AS
SELECT 
  u.id,
  u.username,
  u.display_name,
  us.total_xp,
  us.current_level,
  us.current_streak_days,
  us.rank_percentile,
  (
    SELECT COUNT(*)
    FROM user_achievements ua
    WHERE ua.user_id = u.id
  ) as achievements_count,
  (
    SELECT COUNT(*)
    FROM user_challenge_progress ucp
    WHERE ucp.user_id = u.id AND ucp.status = 'completed'
  ) as challenges_completed,
  (
    SELECT json_build_object(
      'fundamentals', COALESCE(MAX(CASE WHEN lt.difficulty_level = 'fundamentals' THEN utp.progress_percentage END), 0),
      'concepts', COALESCE(MAX(CASE WHEN lt.difficulty_level = 'concepts' THEN utp.progress_percentage END), 0),
      'systems', COALESCE(MAX(CASE WHEN lt.difficulty_level = 'systems' THEN utp.progress_percentage END), 0)
    )
    FROM user_track_progress utp
    JOIN learning_tracks lt ON utp.track_id = lt.id
    WHERE utp.user_id = u.id
  ) as track_progress
FROM users u
JOIN user_stats us ON u.id = us.user_id;
```

### Challenge Prerequisites Check
```sql
CREATE VIEW challenge_prerequisites_status AS
SELECT 
  c.id as challenge_id,
  c.slug as challenge_slug,
  u.id as user_id,
  c.prerequisites,
  (
    SELECT json_agg(json_build_object(
      'prereq_id', prereq_id,
      'completed', EXISTS(
        SELECT 1 FROM user_challenge_progress ucp 
        WHERE ucp.user_id = u.id 
        AND ucp.challenge_id = prereq_id::uuid
        AND ucp.status = 'completed'
      )
    ))
    FROM jsonb_array_elements_text(c.prerequisites) AS prereq_id
  ) as prerequisite_status
FROM challenges c
CROSS JOIN users u;
```

### Leaderboard View
```sql
CREATE VIEW current_leaderboard AS
SELECT 
  u.id,
  u.username,
  u.display_name,
  u.avatar_url,
  us.total_xp,
  us.current_level,
  us.total_challenges_completed,
  us.current_streak_days,
  RANK() OVER (ORDER BY us.total_xp DESC) as xp_rank,
  RANK() OVER (ORDER BY us.total_challenges_completed DESC) as challenge_rank,
  RANK() OVER (ORDER BY us.current_streak_days DESC) as streak_rank
FROM users u
JOIN user_stats us ON u.id = us.user_id
WHERE u.last_active_at > NOW() - INTERVAL '30 days';
```

## Database Functions

### Calculate XP for Level
```sql
CREATE OR REPLACE FUNCTION calculate_level_from_xp(total_xp INTEGER)
RETURNS INTEGER AS $$
BEGIN
  -- XP required = 100 * level * (level + 1) / 2
  -- Solving for level: level = floor((-1 + sqrt(1 + 8*xp/100)) / 2)
  RETURN FLOOR((-1 + SQRT(1 + 8 * total_xp::NUMERIC / 100)) / 2) + 1;
END;
$$ LANGUAGE plpgsql IMMUTABLE;
```

### Update User Stats Trigger
```sql
CREATE OR REPLACE FUNCTION update_user_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update user stats when XP is earned
  UPDATE user_stats 
  SET 
    total_xp = total_xp + NEW.amount,
    current_level = calculate_level_from_xp(total_xp + NEW.amount),
    updated_at = NOW()
  WHERE user_id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_stats_on_xp
AFTER INSERT ON xp_transactions
FOR EACH ROW
EXECUTE FUNCTION update_user_stats();
```

### Check and Unlock Prerequisites
```sql
CREATE OR REPLACE FUNCTION check_and_unlock_challenges(p_user_id UUID)
RETURNS TABLE(newly_unlocked UUID[]) AS $$
DECLARE
  v_newly_unlocked UUID[];
BEGIN
  -- Find challenges where all prerequisites are met
  WITH unlockable AS (
    SELECT c.id
    FROM challenges c
    WHERE NOT EXISTS (
      SELECT 1 
      FROM jsonb_array_elements_text(c.prerequisites) AS prereq_id
      WHERE NOT EXISTS (
        SELECT 1 
        FROM user_challenge_progress ucp
        WHERE ucp.user_id = p_user_id
        AND ucp.challenge_id = prereq_id::uuid
        AND ucp.status = 'completed'
      )
    )
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
```

### Calculate Streak
```sql
CREATE OR REPLACE FUNCTION calculate_user_streak(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_streak INTEGER := 0;
  v_last_date DATE;
  v_current_date DATE;
BEGIN
  -- Get dates of activity
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
```

## Indexes for Performance

### Additional Performance Indexes
```sql
-- For prerequisite checking
CREATE INDEX idx_challenges_prerequisites ON challenges USING GIN (prerequisites);

-- For tag-based searching
CREATE INDEX idx_challenges_tags ON challenges USING GIN (tags);

-- For DDIA concept mapping
CREATE INDEX idx_challenges_ddia ON challenges USING GIN (ddia_concepts);

-- For JSON searches
CREATE INDEX idx_user_preferences ON users USING GIN (preferences);
CREATE INDEX idx_challenge_requirements ON challenge_levels USING GIN (requirements);

-- For time-based queries
CREATE INDEX idx_xp_transactions_user_date ON xp_transactions(user_id, created_at DESC);
CREATE INDEX idx_attempts_user_date ON level_attempts(user_id, created_at DESC);
```

## Sample Queries

### Get User's Current Challenge Status
```sql
SELECT 
  c.slug,
  c.title,
  c.category,
  ucp.status,
  ucp.current_level,
  ucp.levels_completed,
  ARRAY(
    SELECT jsonb_build_object(
      'level', cl.level_number,
      'name', cl.level_name,
      'completed', cl.level_number = ANY(ucp.levels_completed),
      'xp_reward', cl.xp_reward
    )
    FROM challenge_levels cl
    WHERE cl.challenge_id = c.id
    ORDER BY cl.level_number
  ) as levels
FROM challenges c
LEFT JOIN user_challenge_progress ucp ON c.id = ucp.challenge_id AND ucp.user_id = $1
WHERE c.is_active = true
ORDER BY c.order_in_track;
```

### Get Recommended Next Challenges
```sql
WITH user_skill_level AS (
  SELECT skill_level FROM users WHERE id = $1
),
completed_challenges AS (
  SELECT challenge_id 
  FROM user_challenge_progress 
  WHERE user_id = $1 AND status = 'completed'
)
SELECT 
  c.id,
  c.slug,
  c.title,
  c.difficulty_base,
  c.xp_base,
  c.estimated_minutes
FROM challenges c, user_skill_level usl
WHERE c.is_active = true
  AND c.id NOT IN (SELECT challenge_id FROM completed_challenges)
  AND NOT EXISTS (
    -- Check all prerequisites are met
    SELECT 1 
    FROM jsonb_array_elements_text(c.prerequisites) AS prereq_id
    WHERE prereq_id::uuid NOT IN (SELECT challenge_id FROM completed_challenges)
  )
  AND (
    (usl.skill_level = 'beginner' AND c.difficulty_base = 'beginner') OR
    (usl.skill_level = 'intermediate' AND c.difficulty_base IN ('beginner', 'intermediate')) OR
    (usl.skill_level = 'advanced')
  )
ORDER BY 
  CASE c.difficulty_base
    WHEN 'beginner' THEN 1
    WHEN 'intermediate' THEN 2
    WHEN 'advanced' THEN 3
  END,
  c.order_in_track
LIMIT 5;
```

## Data Migration Strategy

### From Current System
```sql
-- Migrate existing progress data
INSERT INTO user_challenge_progress (user_id, challenge_id, status, levels_completed, xp_earned)
SELECT 
  old.user_id,
  c.id,
  CASE 
    WHEN old.completed_levels = ARRAY[1,2,3,4,5] THEN 'completed'
    WHEN array_length(old.completed_levels, 1) > 0 THEN 'in_progress'
    ELSE 'not_started'
  END,
  old.completed_levels,
  old.total_xp
FROM old_progress_table old
JOIN challenges c ON c.slug = old.problem_id;
```

## Performance Considerations

1. **Partitioning**: Consider partitioning `level_attempts` and `xp_transactions` by date for large-scale deployments
2. **Read Replicas**: Use read replicas for leaderboard and analytics queries
3. **Caching**: Cache user dashboard data with 5-minute TTL
4. **Batch Processing**: Process achievement checks and leaderboard updates in batch jobs
5. **Connection Pooling**: Use connection pooling for high-concurrency scenarios

## Security Considerations

1. **Row-Level Security**: Implement RLS for user-specific data
2. **API Rate Limiting**: Limit XP transaction submissions to prevent gaming
3. **Input Validation**: Validate all JSON inputs before storage
4. **Audit Logging**: Log all XP and achievement transactions

This schema provides a robust foundation for the progressive flow system design course platform with full support for gamification, prerequisites, and adaptive learning paths.