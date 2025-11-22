-- Progressive Flow Migration 006: Seed Challenges and Initial Data
-- Seeds learning tracks, achievements, skills, and challenge data

-- Note: Challenge data is generated dynamically by the seed script
-- Run: npm run seed:progressive-flow

-- =====================================================
-- LEARNING TRACKS
-- =====================================================
INSERT INTO learning_tracks (slug, title, description, difficulty_level, estimated_hours, order_index) VALUES
('fundamentals', 'Fundamentals', 'Master the foundational concepts of system design', 'fundamentals', 40, 1),
('concepts', 'Core Concepts', 'Learn essential patterns and architectural concepts', 'concepts', 60, 2),
('systems', 'Real-World Systems', 'Design production-grade distributed systems', 'systems', 80, 3)
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- ACHIEVEMENTS
-- =====================================================
INSERT INTO achievements (slug, name, description, category, rarity, xp_reward, criteria) VALUES
-- First-time achievements
('first_challenge', 'First Steps', 'Complete your first challenge', 'milestone', 'common', 50, 
 '{"type": "challenges_completed", "count": 1}'::jsonb),
('first_perfect', 'Perfectionist', 'Get a perfect score on a level', 'mastery', 'rare', 100,
 '{"type": "perfect_score", "count": 1}'::jsonb),

-- Milestone achievements
('challenge_5', 'Getting Started', 'Complete 5 challenges', 'milestone', 'common', 100,
 '{"type": "challenges_completed", "count": 5}'::jsonb),
('challenge_10', 'Rising Star', 'Complete 10 challenges', 'milestone', 'rare', 200,
 '{"type": "challenges_completed", "count": 10}'::jsonb),
('challenge_25', 'Committed Learner', 'Complete 25 challenges', 'milestone', 'epic', 500,
 '{"type": "challenges_completed", "count": 25}'::jsonb),
('challenge_50', 'System Design Expert', 'Complete 50 challenges', 'milestone', 'legendary', 1000,
 '{"type": "challenges_completed", "count": 50}'::jsonb),
('challenge_61', 'Master of All', 'Complete all 61 challenges', 'milestone', 'legendary', 2000,
 '{"type": "challenges_completed", "count": 61}'::jsonb),

-- Streak achievements
('streak_3', '3 Day Streak', 'Maintain a 3-day learning streak', 'streak', 'common', 50,
 '{"type": "streak_days", "days": 3}'::jsonb),
('streak_7', 'Week Warrior', 'Maintain a 7-day learning streak', 'streak', 'rare', 150,
 '{"type": "streak_days", "days": 7}'::jsonb),
('streak_14', 'Fortnight Fighter', 'Maintain a 14-day learning streak', 'streak', 'epic', 300,
 '{"type": "streak_days", "days": 14}'::jsonb),
('streak_30', 'Monthly Master', 'Maintain a 30-day learning streak', 'streak', 'legendary', 1000,
 '{"type": "streak_days", "days": 30}'::jsonb),

-- XP achievements
('xp_1000', 'XP Hunter', 'Earn 1,000 XP', 'xp', 'common', 100,
 '{"type": "total_xp", "amount": 1000}'::jsonb),
('xp_5000', 'XP Collector', 'Earn 5,000 XP', 'xp', 'rare', 200,
 '{"type": "total_xp", "amount": 5000}'::jsonb),
('xp_10000', 'XP Master', 'Earn 10,000 XP', 'xp', 'epic', 500,
 '{"type": "total_xp", "amount": 10000}'::jsonb),
('xp_25000', 'XP Legend', 'Earn 25,000 XP', 'xp', 'legendary', 1000,
 '{"type": "total_xp", "amount": 25000}'::jsonb),

-- Track completion achievements
('track_fundamentals', 'Fundamentals Complete', 'Complete the Fundamentals track', 'track', 'rare', 500,
 '{"type": "track_complete", "trackId": "fundamentals"}'::jsonb),
('track_concepts', 'Concepts Complete', 'Complete the Core Concepts track', 'track', 'epic', 750,
 '{"type": "track_complete", "trackId": "concepts"}'::jsonb),
('track_systems', 'Systems Complete', 'Complete the Real-World Systems track', 'track', 'legendary', 1500,
 '{"type": "track_complete", "trackId": "systems"}'::jsonb)
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- SKILLS
-- =====================================================
INSERT INTO skills (slug, name, description, category, max_level, xp_per_level) VALUES
-- Caching skills
('caching_basics', 'Caching Fundamentals', 'Understanding cache patterns and strategies', 'caching', 5, 100),
('cache_invalidation', 'Cache Invalidation', 'Master cache invalidation strategies', 'caching', 5, 150),
('distributed_cache', 'Distributed Caching', 'Design distributed cache systems', 'caching', 5, 200),

-- Database skills
('database_design', 'Database Design', 'Design efficient database schemas', 'database', 5, 100),
('sql_optimization', 'SQL Optimization', 'Optimize database queries', 'database', 5, 150),
('nosql_patterns', 'NoSQL Patterns', 'Design with NoSQL databases', 'database', 5, 150),
('database_sharding', 'Database Sharding', 'Implement sharding strategies', 'database', 5, 200),

-- Scalability skills
('load_balancing', 'Load Balancing', 'Design load balancing strategies', 'scalability', 5, 100),
('horizontal_scaling', 'Horizontal Scaling', 'Scale systems horizontally', 'scalability', 5, 150),
('vertical_scaling', 'Vertical Scaling', 'Optimize vertical scaling', 'scalability', 5, 100),

-- Reliability skills
('fault_tolerance', 'Fault Tolerance', 'Design fault-tolerant systems', 'reliability', 5, 150),
('disaster_recovery', 'Disaster Recovery', 'Implement DR strategies', 'reliability', 5, 200),
('monitoring', 'Monitoring & Observability', 'Design monitoring systems', 'reliability', 5, 150),

-- Performance skills
('performance_optimization', 'Performance Optimization', 'Optimize system performance', 'performance', 5, 150),
('latency_reduction', 'Latency Reduction', 'Reduce system latency', 'performance', 5, 200),

-- Architecture skills
('microservices', 'Microservices', 'Design microservice architectures', 'architecture', 5, 200),
('event_driven', 'Event-Driven Architecture', 'Design event-driven systems', 'architecture', 5, 200),
('api_design', 'API Design', 'Design robust APIs', 'architecture', 5, 150)
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- INITIAL ADMIN USER (Optional - for testing)
-- =====================================================
-- Uncomment to create a test user
-- INSERT INTO users (email, username, display_name, skill_level, onboarding_completed) VALUES
-- ('admin@progressive.dev', 'admin', 'Admin User', 'advanced', true)
-- ON CONFLICT (email) DO NOTHING;

-- =====================================================
-- NOTES
-- =====================================================
-- Challenge data (61 challenges with 5 levels each) should be seeded via:
-- 1. Backend API endpoint that reads from tieredChallenges
-- 2. Or run the seed script: backend/scripts/seed-progressive-challenges.ts
--
-- This keeps the migration file clean and allows for dynamic challenge updates
-- without modifying the migration.
