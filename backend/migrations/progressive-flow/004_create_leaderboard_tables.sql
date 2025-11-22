-- Progressive Flow Migration 004: Leaderboard Tables
-- Creates leaderboard rankings and competition tables

-- =====================================================
-- LEADERBOARD ENTRIES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS leaderboard_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  period_type VARCHAR(20) NOT NULL CHECK (period_type IN ('daily', 'weekly', 'monthly', 'all_time')),
  period_date DATE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  metric_type VARCHAR(50) NOT NULL,
  metric_value INTEGER NOT NULL,
  rank INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(period_type, period_date, user_id, metric_type)
);

CREATE INDEX IF NOT EXISTS idx_leaderboard_period ON leaderboard_entries(period_type, period_date);
CREATE INDEX IF NOT EXISTS idx_leaderboard_rank ON leaderboard_entries(rank);
CREATE INDEX IF NOT EXISTS idx_leaderboard_user ON leaderboard_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_leaderboard_metric ON leaderboard_entries(metric_type);
CREATE INDEX IF NOT EXISTS idx_leaderboard_period_rank ON leaderboard_entries(period_type, period_date, metric_type, rank);

-- =====================================================
-- LEADERBOARD SNAPSHOTS TABLE
-- Stores historical leaderboard data
-- =====================================================
CREATE TABLE IF NOT EXISTS leaderboard_snapshots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  period_type VARCHAR(20) NOT NULL,
  period_date DATE NOT NULL,
  metric_type VARCHAR(50) NOT NULL,
  snapshot_data JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(period_type, period_date, metric_type)
);

CREATE INDEX IF NOT EXISTS idx_snapshots_period ON leaderboard_snapshots(period_type, period_date);

-- =====================================================
-- DATABASE FUNCTIONS
-- =====================================================

-- Function to update leaderboard rankings
CREATE OR REPLACE FUNCTION update_leaderboard_rankings(
  p_period_type VARCHAR(20),
  p_period_date DATE,
  p_metric_type VARCHAR(50)
) RETURNS INTEGER AS $$
DECLARE
  v_affected_rows INTEGER := 0;
BEGIN
  -- Delete existing entries for this period/metric
  DELETE FROM leaderboard_entries
  WHERE period_type = p_period_type
  AND period_date = p_period_date
  AND metric_type = p_metric_type;
  
  -- Insert new rankings based on metric type
  IF p_metric_type = 'xp' THEN
    INSERT INTO leaderboard_entries (period_type, period_date, user_id, metric_type, metric_value, rank)
    SELECT 
      p_period_type,
      p_period_date,
      user_id,
      'xp',
      total_xp,
      RANK() OVER (ORDER BY total_xp DESC)
    FROM user_stats
    WHERE total_xp > 0
    ORDER BY total_xp DESC;
    
    GET DIAGNOSTICS v_affected_rows = ROW_COUNT;
    
  ELSIF p_metric_type = 'challenges' THEN
    INSERT INTO leaderboard_entries (period_type, period_date, user_id, metric_type, metric_value, rank)
    SELECT 
      p_period_type,
      p_period_date,
      user_id,
      'challenges',
      total_challenges_completed,
      RANK() OVER (ORDER BY total_challenges_completed DESC)
    FROM user_stats
    WHERE total_challenges_completed > 0
    ORDER BY total_challenges_completed DESC;
    
    GET DIAGNOSTICS v_affected_rows = ROW_COUNT;
    
  ELSIF p_metric_type = 'streak' THEN
    INSERT INTO leaderboard_entries (period_type, period_date, user_id, metric_type, metric_value, rank)
    SELECT 
      p_period_type,
      p_period_date,
      user_id,
      'streak',
      current_streak_days,
      RANK() OVER (ORDER BY current_streak_days DESC)
    FROM user_stats
    WHERE current_streak_days > 0
    ORDER BY current_streak_days DESC;
    
    GET DIAGNOSTICS v_affected_rows = ROW_COUNT;
  END IF;
  
  RETURN v_affected_rows;
END;
$$ LANGUAGE plpgsql;

-- Function to get user's rank for a specific period/metric
CREATE OR REPLACE FUNCTION get_user_rank(
  p_user_id UUID,
  p_period_type VARCHAR(20),
  p_metric_type VARCHAR(50)
) RETURNS JSONB AS $$
DECLARE
  v_rank INTEGER;
  v_metric_value INTEGER;
  v_total_users INTEGER;
  v_percentile DECIMAL(5,2);
  v_period_date DATE;
BEGIN
  -- Get current period date
  IF p_period_type = 'daily' THEN
    v_period_date := CURRENT_DATE;
  ELSIF p_period_type = 'weekly' THEN
    v_period_date := DATE_TRUNC('week', CURRENT_DATE)::DATE;
  ELSIF p_period_type = 'monthly' THEN
    v_period_date := DATE_TRUNC('month', CURRENT_DATE)::DATE;
  ELSE
    v_period_date := NULL; -- all_time
  END IF;
  
  -- Get user's rank
  SELECT rank, metric_value INTO v_rank, v_metric_value
  FROM leaderboard_entries
  WHERE user_id = p_user_id
  AND period_type = p_period_type
  AND (period_date = v_period_date OR (period_date IS NULL AND v_period_date IS NULL))
  AND metric_type = p_metric_type;
  
  -- Get total users in leaderboard
  SELECT COUNT(*) INTO v_total_users
  FROM leaderboard_entries
  WHERE period_type = p_period_type
  AND (period_date = v_period_date OR (period_date IS NULL AND v_period_date IS NULL))
  AND metric_type = p_metric_type;
  
  -- Calculate percentile
  IF v_total_users > 0 AND v_rank IS NOT NULL THEN
    v_percentile := ROUND(((v_total_users - v_rank + 1)::NUMERIC / v_total_users * 100), 2);
  ELSE
    v_percentile := NULL;
  END IF;
  
  RETURN jsonb_build_object(
    'rank', v_rank,
    'metricValue', v_metric_value,
    'totalUsers', v_total_users,
    'percentile', v_percentile
  );
END;
$$ LANGUAGE plpgsql;

-- Function to get top N users from leaderboard
CREATE OR REPLACE FUNCTION get_top_leaderboard_users(
  p_period_type VARCHAR(20),
  p_metric_type VARCHAR(50),
  p_limit INTEGER DEFAULT 100
) RETURNS TABLE (
  rank INTEGER,
  user_id UUID,
  username VARCHAR(100),
  display_name VARCHAR(200),
  avatar_url TEXT,
  metric_value INTEGER,
  current_level INTEGER
) AS $$
DECLARE
  v_period_date DATE;
BEGIN
  -- Get current period date
  IF p_period_type = 'daily' THEN
    v_period_date := CURRENT_DATE;
  ELSIF p_period_type = 'weekly' THEN
    v_period_date := DATE_TRUNC('week', CURRENT_DATE)::DATE;
  ELSIF p_period_type = 'monthly' THEN
    v_period_date := DATE_TRUNC('month', CURRENT_DATE)::DATE;
  ELSE
    v_period_date := NULL; -- all_time
  END IF;
  
  RETURN QUERY
  SELECT 
    le.rank,
    u.id as user_id,
    u.username,
    u.display_name,
    u.avatar_url,
    le.metric_value,
    us.current_level
  FROM leaderboard_entries le
  JOIN users u ON le.user_id = u.id
  JOIN user_stats us ON u.id = us.user_id
  WHERE le.period_type = p_period_type
  AND (le.period_date = v_period_date OR (le.period_date IS NULL AND v_period_date IS NULL))
  AND le.metric_type = p_metric_type
  ORDER BY le.rank
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Function to create leaderboard snapshot
CREATE OR REPLACE FUNCTION create_leaderboard_snapshot(
  p_period_type VARCHAR(20),
  p_period_date DATE,
  p_metric_type VARCHAR(50)
) RETURNS UUID AS $$
DECLARE
  v_snapshot_id UUID;
  v_snapshot_data JSONB;
BEGIN
  -- Build snapshot data
  SELECT jsonb_agg(
    jsonb_build_object(
      'rank', rank,
      'userId', user_id,
      'metricValue', metric_value
    ) ORDER BY rank
  ) INTO v_snapshot_data
  FROM leaderboard_entries
  WHERE period_type = p_period_type
  AND period_date = p_period_date
  AND metric_type = p_metric_type;
  
  -- Insert snapshot
  INSERT INTO leaderboard_snapshots (period_type, period_date, metric_type, snapshot_data)
  VALUES (p_period_type, p_period_date, p_metric_type, v_snapshot_data)
  ON CONFLICT (period_type, period_date, metric_type)
  DO UPDATE SET 
    snapshot_data = EXCLUDED.snapshot_data,
    created_at = NOW()
  RETURNING id INTO v_snapshot_id;
  
  RETURN v_snapshot_id;
END;
$$ LANGUAGE plpgsql;

-- Function to update all leaderboards
CREATE OR REPLACE FUNCTION refresh_all_leaderboards() RETURNS VOID AS $$
DECLARE
  v_current_date DATE := CURRENT_DATE;
  v_week_date DATE := DATE_TRUNC('week', CURRENT_DATE)::DATE;
  v_month_date DATE := DATE_TRUNC('month', CURRENT_DATE)::DATE;
BEGIN
  -- Daily leaderboards
  PERFORM update_leaderboard_rankings('daily', v_current_date, 'xp');
  PERFORM update_leaderboard_rankings('daily', v_current_date, 'challenges');
  PERFORM update_leaderboard_rankings('daily', v_current_date, 'streak');
  
  -- Weekly leaderboards
  PERFORM update_leaderboard_rankings('weekly', v_week_date, 'xp');
  PERFORM update_leaderboard_rankings('weekly', v_week_date, 'challenges');
  PERFORM update_leaderboard_rankings('weekly', v_week_date, 'streak');
  
  -- Monthly leaderboards
  PERFORM update_leaderboard_rankings('monthly', v_month_date, 'xp');
  PERFORM update_leaderboard_rankings('monthly', v_month_date, 'challenges');
  PERFORM update_leaderboard_rankings('monthly', v_month_date, 'streak');
  
  -- All-time leaderboards (use current date as marker)
  PERFORM update_leaderboard_rankings('all_time', v_current_date, 'xp');
  PERFORM update_leaderboard_rankings('all_time', v_current_date, 'challenges');
  PERFORM update_leaderboard_rankings('all_time', v_current_date, 'streak');
  
  -- Create snapshots
  PERFORM create_leaderboard_snapshot('daily', v_current_date, 'xp');
  PERFORM create_leaderboard_snapshot('weekly', v_week_date, 'xp');
  PERFORM create_leaderboard_snapshot('monthly', v_month_date, 'xp');
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- VIEWS
-- =====================================================

-- Current leaderboard view (all-time)
CREATE OR REPLACE VIEW current_leaderboard AS
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
WHERE u.last_active_at > NOW() - INTERVAL '30 days'
ORDER BY us.total_xp DESC;

-- =====================================================
-- ROLLBACK
-- =====================================================
-- To rollback this migration, run:
-- DROP VIEW IF EXISTS current_leaderboard CASCADE;
-- DROP FUNCTION IF EXISTS refresh_all_leaderboards();
-- DROP FUNCTION IF EXISTS create_leaderboard_snapshot(VARCHAR, DATE, VARCHAR);
-- DROP FUNCTION IF EXISTS get_top_leaderboard_users(VARCHAR, VARCHAR, INTEGER);
-- DROP FUNCTION IF EXISTS get_user_rank(UUID, VARCHAR, VARCHAR);
-- DROP FUNCTION IF EXISTS update_leaderboard_rankings(VARCHAR, DATE, VARCHAR);
-- DROP TABLE IF EXISTS leaderboard_snapshots CASCADE;
-- DROP TABLE IF EXISTS leaderboard_entries CASCADE;