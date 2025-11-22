-- Progressive Flow Migration 005: Indexes and Views
-- Creates additional performance indexes and useful views

-- =====================================================
-- ADDITIONAL PERFORMANCE INDEXES
-- =====================================================

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_user_progress_status_level ON user_challenge_progress(user_id, status, current_level);
CREATE INDEX IF NOT EXISTS idx_attempts_user_challenge_date ON level_attempts(user_id, challenge_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sessions_user_type_date ON learning_sessions(user_id, session_type, start_time DESC);

-- GIN indexes for JSONB columns
CREATE INDEX IF NOT EXISTS idx_user_preferences ON users USING GIN (preferences);
CREATE INDEX IF NOT EXISTS idx_track_metadata ON learning_tracks USING GIN (metadata);
CREATE INDEX IF NOT EXISTS idx_challenge_metadata ON challenges USING GIN (metadata);

-- Partial indexes for active records
CREATE INDEX IF NOT EXISTS idx_active_challenges ON challenges(id) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_active_tracks ON learning_tracks(id) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_active_achievements ON achievements(id) WHERE is_active = true;

-- Covering indexes for common queries
CREATE INDEX IF NOT EXISTS idx_user_stats_covering ON user_stats(user_id, total_xp, current_level, total_challenges_completed);

-- =====================================================
-- MATERIALIZED VIEWS
-- =====================================================

-- User dashboard summary (can be refreshed periodically)
CREATE MATERIALIZED VIEW IF NOT EXISTS user_dashboard_summary AS
SELECT 
  u.id as user_id,
  u.username,
  u.display_name,
  u.avatar_url,
  u.skill_level,
  us.total_xp,
  us.current_level,
  us.current_streak_days,
  us.longest_streak_days,
  us.total_challenges_completed,
  us.total_levels_completed,
  us.rank_percentile,
  (
    SELECT COUNT(*)
    FROM user_achievements ua
    WHERE ua.user_id = u.id
  ) as achievements_count,
  (
    SELECT COUNT(*)
    FROM user_challenge_progress ucp
    WHERE ucp.user_id = u.id AND ucp.status = 'in_progress'
  ) as in_progress_challenges,
  (
    SELECT jsonb_agg(
      jsonb_build_object(
        'trackId', lt.id,
        'slug', lt.slug,
        'title', lt.title,
        'progress', COALESCE(utp.progress_percentage, 0),
        'challengesCompleted', COALESCE(utp.challenges_completed, 0),
        'totalChallenges', COALESCE(utp.total_challenges, 0)
      )
    )
    FROM learning_tracks lt
    LEFT JOIN user_track_progress utp ON lt.id = utp.track_id AND utp.user_id = u.id
    WHERE lt.is_active = true
  ) as track_progress,
  u.last_active_at
FROM users u
JOIN user_stats us ON u.id = us.user_id;

CREATE UNIQUE INDEX IF NOT EXISTS idx_dashboard_summary_user ON user_dashboard_summary(user_id);

-- =====================================================
-- REGULAR VIEWS
-- =====================================================

-- Challenge progress view with detailed information
CREATE OR REPLACE VIEW challenge_progress_detail AS
SELECT 
  ucp.user_id,
  c.id as challenge_id,
  c.slug as challenge_slug,
  c.title as challenge_title,
  c.category,
  c.difficulty_base,
  c.track_id,
  lt.title as track_title,
  ucp.status,
  ucp.current_level,
  ucp.levels_completed,
  ucp.total_attempts,
  ucp.total_time_spent_minutes,
  ucp.best_score,
  ucp.xp_earned,
  ucp.unlock_date,
  ucp.start_date,
  ucp.completion_date,
  (
    SELECT jsonb_agg(
      jsonb_build_object(
        'levelNumber', cl.level_number,
        'levelName', cl.level_name,
        'completed', cl.level_number = ANY(ucp.levels_completed),
        'xpReward', cl.xp_reward
      ) ORDER BY cl.level_number
    )
    FROM challenge_levels cl
    WHERE cl.challenge_id = c.id
  ) as levels
FROM user_challenge_progress ucp
JOIN challenges c ON ucp.challenge_id = c.id
LEFT JOIN learning_tracks lt ON c.track_id = lt.id;

-- Recent activity view
CREATE OR REPLACE VIEW recent_user_activity AS
SELECT 
  la.user_id,
  la.challenge_id,
  c.title as challenge_title,
  c.slug as challenge_slug,
  la.level_number,
  cl.level_name,
  la.score,
  la.passed,
  la.xp_earned,
  la.time_spent_minutes,
  la.created_at
FROM level_attempts la
JOIN challenges c ON la.challenge_id = c.id
JOIN challenge_levels cl ON c.id = cl.challenge_id AND la.level_number = cl.level_number
ORDER BY la.created_at DESC;

-- User achievement progress view
CREATE OR REPLACE VIEW user_achievement_progress AS
SELECT 
  u.id as user_id,
  a.id as achievement_id,
  a.slug as achievement_slug,
  a.name as achievement_name,
  a.description,
  a.category,
  a.rarity,
  a.xp_reward,
  a.criteria,
  COALESCE(ua.unlocked_at, NULL) as unlocked_at,
  COALESCE(ua.progress, 0) as progress,
  CASE WHEN ua.id IS NOT NULL THEN true ELSE false END as is_unlocked
FROM users u
CROSS JOIN achievements a
LEFT JOIN user_achievements ua ON u.id = ua.user_id AND a.id = ua.achievement_id
WHERE a.is_active = true;

-- Track completion summary
CREATE OR REPLACE VIEW track_completion_summary AS
SELECT 
  lt.id as track_id,
  lt.slug as track_slug,
  lt.title as track_title,
  lt.difficulty_level,
  COUNT(DISTINCT c.id) as total_challenges,
  COUNT(DISTINCT CASE WHEN c.difficulty_base = 'beginner' THEN c.id END) as beginner_count,
  COUNT(DISTINCT CASE WHEN c.difficulty_base = 'intermediate' THEN c.id END) as intermediate_count,
  COUNT(DISTINCT CASE WHEN c.difficulty_base = 'advanced' THEN c.id END) as advanced_count,
  SUM(c.xp_base) as total_xp_available,
  lt.estimated_hours
FROM learning_tracks lt
LEFT JOIN challenges c ON lt.id = c.track_id AND c.is_active = true
WHERE lt.is_active = true
GROUP BY lt.id, lt.slug, lt.title, lt.difficulty_level, lt.estimated_hours;

-- Daily challenge leaderboard view
CREATE OR REPLACE VIEW daily_challenge_leaderboard AS
SELECT 
  dc.id as daily_challenge_id,
  dc.date,
  c.title as challenge_title,
  c.slug as challenge_slug,
  dca.user_id,
  u.username,
  u.display_name,
  dca.score,
  dca.xp_earned,
  dca.rank,
  dca.completed_at
FROM daily_challenges dc
JOIN challenges c ON dc.challenge_id = c.id
LEFT JOIN daily_challenge_attempts dca ON dc.id = dca.daily_challenge_id
LEFT JOIN users u ON dca.user_id = u.id
WHERE dc.date >= CURRENT_DATE - INTERVAL '7 days'
ORDER BY dc.date DESC, dca.rank ASC;

-- User skill tree view
CREATE OR REPLACE VIEW user_skill_tree AS
SELECT 
  us.user_id,
  s.id as skill_id,
  s.slug as skill_slug,
  s.name as skill_name,
  s.description,
  s.category,
  s.parent_skill_id,
  s.max_level,
  COALESCE(us.current_level, 0) as current_level,
  COALESCE(us.points_allocated, 0) as points_allocated,
  us.unlocked_at,
  us.mastered_at,
  CASE WHEN us.current_level >= s.max_level THEN true ELSE false END as is_mastered
FROM skills s
LEFT JOIN user_skills us ON s.id = us.skill_id
WHERE s.is_active = true;

-- =====================================================
-- HELPER FUNCTIONS FOR VIEWS
-- =====================================================

-- Function to refresh materialized views
CREATE OR REPLACE FUNCTION refresh_dashboard_summaries() RETURNS VOID AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY user_dashboard_summary;
END;
$$ LANGUAGE plpgsql;

-- Function to get user's recent activity
CREATE OR REPLACE FUNCTION get_user_recent_activity(
  p_user_id UUID,
  p_limit INTEGER DEFAULT 10
) RETURNS TABLE (
  challenge_title VARCHAR(200),
  challenge_slug VARCHAR(100),
  level_number INTEGER,
  level_name VARCHAR(100),
  score DECIMAL(5,2),
  passed BOOLEAN,
  xp_earned INTEGER,
  created_at TIMESTAMP
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    rua.challenge_title,
    rua.challenge_slug,
    rua.level_number,
    rua.level_name,
    rua.score,
    rua.passed,
    rua.xp_earned,
    rua.created_at
  FROM recent_user_activity rua
  WHERE rua.user_id = p_user_id
  ORDER BY rua.created_at DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- PERFORMANCE MONITORING
-- =====================================================

-- View to monitor slow queries (requires pg_stat_statements extension)
CREATE OR REPLACE VIEW slow_queries AS
SELECT 
  queryid,
  LEFT(query, 100) as query_preview,
  calls,
  total_exec_time,
  mean_exec_time,
  max_exec_time,
  stddev_exec_time
FROM pg_stat_statements
WHERE mean_exec_time > 100  -- queries averaging over 100ms
ORDER BY mean_exec_time DESC
LIMIT 20;

-- =====================================================
-- ROLLBACK
-- =====================================================
-- To rollback this migration, run:
-- DROP VIEW IF EXISTS slow_queries CASCADE;
-- DROP FUNCTION IF EXISTS get_user_recent_activity(UUID, INTEGER);
-- DROP FUNCTION IF EXISTS refresh_dashboard_summaries();
-- DROP VIEW IF EXISTS user_skill_tree CASCADE;
-- DROP VIEW IF EXISTS daily_challenge_leaderboard CASCADE;
-- DROP VIEW IF EXISTS track_completion_summary CASCADE;
-- DROP VIEW IF EXISTS user_achievement_progress CASCADE;
-- DROP VIEW IF EXISTS recent_user_activity CASCADE;
-- DROP VIEW IF EXISTS challenge_progress_detail CASCADE;
-- DROP MATERIALIZED VIEW IF EXISTS user_dashboard_summary CASCADE;
-- DROP INDEX IF EXISTS idx_user_stats_covering;
-- DROP INDEX IF EXISTS idx_active_achievements;
-- DROP INDEX IF EXISTS idx_active_tracks;
-- DROP INDEX IF EXISTS idx_active_challenges;
-- DROP INDEX IF EXISTS idx_challenge_metadata;
-- DROP INDEX IF EXISTS idx_track_metadata;
-- DROP INDEX IF EXISTS idx_user_preferences;
-- DROP INDEX IF EXISTS idx_sessions_user_type_date;
-- DROP INDEX IF EXISTS idx_attempts_user_challenge_date;
-- DROP INDEX IF EXISTS idx_user_progress_status_level;