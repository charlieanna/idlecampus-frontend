# Progressive Flow Database Migrations

This directory contains PostgreSQL database migrations for the Progressive Flow system design learning platform.

## Overview

The Progressive Flow system includes:
- **61 System Design Challenges** with 5 levels each (305 total levels)
- **Gamification System** (XP, achievements, badges, skills)
- **Learning Tracks** (Fundamentals, Concepts, Systems)
- **Leaderboards** (Daily, Weekly, Monthly, All-Time)
- **User Progress Tracking**

## Migration Files

1. **001_create_users_and_progress_tables.sql**
   - Users table with authentication
   - User stats and progress tracking
   - Learning tracks and user track progress
   - Challenge progress and level attempts
   - Assessment results
   - Learning sessions
   - Notifications

2. **002_create_challenge_tables.sql**
   - Challenges (61 system design problems)
   - Challenge levels (5 per challenge)
   - Daily challenges
   - Prerequisite checking functions
   - Auto-unlock triggers

3. **003_create_gamification_tables.sql**
   - XP transactions
   - Achievements and user achievements
   - Skills and user skills
   - Level calculation functions
   - Streak tracking
   - Achievement checking and awarding

4. **004_create_leaderboard_tables.sql**
   - Leaderboard entries (daily/weekly/monthly/all-time)
   - Leaderboard snapshots for history
   - Ranking calculation functions
   - User rank retrieval

5. **005_create_indexes_and_views.sql**
   - Performance indexes (composite, GIN, partial)
   - Materialized views for dashboards
   - Regular views for common queries
   - Helper functions

6. **006_seed_challenges.sql**
   - Learning tracks seed data
   - Achievements seed data
   - Skills seed data
   - Notes on challenge seeding strategy

## Prerequisites

1. **PostgreSQL 14+** installed and running
2. **Node.js 18+** for running migration scripts
3. **Backend dependencies** installed:
   ```bash
   cd backend
   npm install
   ```

4. **Environment Variables** configured:
   ```bash
   # .env or environment
   POSTGRES_HOST=localhost
   POSTGRES_PORT=5432
   POSTGRES_USER=system_design
   POSTGRES_PASSWORD=your_password
   POSTGRES_DB=system_design_test
   ```

## Running Migrations

### Run All Pending Migrations
```bash
cd backend
npm run migrate:progressive
```

This will:
1. Create the migrations tracking table
2. Check which migrations have been applied
3. Run pending migrations in order
4. Record successful migrations

### Check Migration Status
```bash
npm run migrate:progressive:status
```

Shows:
- ✓ Applied migrations
- ✗ Pending migrations
- Total count

### Rollback Last Migration
```bash
npm run migrate:progressive:rollback
```

⚠️ **Warning**: This will drop tables and data. Use with caution!

## Manual Migration (Alternative)

If you prefer to run migrations manually:

```bash
cd backend/migrations/progressive-flow

# Connect to PostgreSQL
psql -h localhost -U system_design -d system_design_test

# Run migrations in order
\i 001_create_users_and_progress_tables.sql
\i 002_create_challenge_tables.sql
\i 003_create_gamification_tables.sql
\i 004_create_leaderboard_tables.sql
\i 005_create_indexes_and_views.sql
\i 006_seed_challenges.sql
```

## Database Schema Summary

### Core Tables
- `users` - User accounts and authentication
- `user_stats` - Aggregated user statistics
- `challenges` - 61 system design challenges
- `challenge_levels` - 5 levels per challenge (305 total)
- `user_challenge_progress` - User progress per challenge
- `level_attempts` - Individual level attempt history

### Gamification Tables
- `xp_transactions` - All XP awards
- `achievements` - Achievement definitions
- `user_achievements` - Unlocked achievements
- `skills` - Skill tree definitions
- `user_skills` - User skill allocations

### Leaderboard Tables
- `leaderboard_entries` - Current rankings
- `leaderboard_snapshots` - Historical data

### Supporting Tables
- `learning_tracks` - Course tracks
- `user_track_progress` - Track completion
- `daily_challenges` - Daily challenge system
- `assessment_results` - Skill assessments
- `notifications` - User notifications

## Key Features

### Automatic Triggers
- **Auto-create user_stats** when user is created
- **Update last_active_at** on activity
- **Update user level** when XP is earned
- **Calculate streaks** on daily activity
- **Check achievements** after level completion
- **Unlock challenges** when prerequisites met

### Database Functions
- `calculate_level_from_xp(xp)` - Convert XP to user level
- `get_xp_for_level(level)` - Get XP required for level
- `check_challenge_prerequisites(user_id, challenge_id)` - Verify prerequisites
- `calculate_user_streak(user_id)` - Calculate current streak
- `check_and_award_achievements(user_id)` - Check and award achievements
- `update_leaderboard_rankings(period, date, metric)` - Update leaderboards
- `get_user_rank(user_id, period, metric)` - Get user's rank

### Views
- `user_dashboard_summary` (materialized) - User dashboard data
- `challenge_progress_detail` - Detailed challenge progress
- `recent_user_activity` - Recent activity feed
- `current_leaderboard` - Real-time leaderboard
- `track_completion_summary` - Track statistics

## Performance Considerations

### Indexes Created
- Primary keys and foreign keys
- Composite indexes for common queries
- GIN indexes for JSONB columns
- Partial indexes for active records
- Covering indexes for frequent queries

### Query Optimization
- Materialized views for dashboards (refresh periodically)
- Composite indexes for multi-column queries
- Partial indexes to reduce index size
- JSONB indexes for flexible queries

### Recommended Refresh Strategy
```sql
-- Refresh materialized views hourly
SELECT refresh_dashboard_summaries();

-- Update leaderboards daily
SELECT refresh_all_leaderboards();
```

## Seeding Challenges

Challenge data (61 challenges) should be seeded via:

1. **Backend API Endpoint** (Recommended):
   - Create `/api/progressive/admin/seed-challenges` endpoint
   - Reads from `tieredChallenges` in frontend code
   - Maps to progressive flow format
   - Inserts into database

2. **Seed Script** (Alternative):
   ```bash
   cd backend
   npm run seed:progressive-challenges
   ```

This approach keeps migrations clean and allows for dynamic challenge updates.

## Rollback Strategy

Each migration includes rollback instructions in comments:
```sql
-- To rollback this migration, run:
-- DROP TABLE IF EXISTS table_name CASCADE;
-- DROP FUNCTION IF EXISTS function_name();
```

To rollback manually:
```bash
psql -h localhost -U system_design -d system_design_test

# Copy rollback commands from migration file
# Paste and execute
```

## Testing Migrations

1. **Create Test Database**:
   ```sql
   CREATE DATABASE progressive_flow_test;
   ```

2. **Run Migrations**:
   ```bash
   POSTGRES_DB=progressive_flow_test npm run migrate:progressive
   ```

3. **Verify Tables**:
   ```sql
   \dt
   \df
   SELECT * FROM progressive_flow_migrations;
   ```

4. **Test Rollback**:
   ```bash
   POSTGRES_DB=progressive_flow_test npm run migrate:progressive:rollback
   ```

## Troubleshooting

### Migration Fails
- Check PostgreSQL connection
- Verify environment variables
- Check migration order
- Review error messages in console

### Missing Tables
- Run `npm run migrate:progressive:status` to check
- Ensure migrations ran successfully
- Check `progressive_flow_migrations` table

### Performance Issues
- Refresh materialized views: `SELECT refresh_dashboard_summaries();`
- Update leaderboards: `SELECT refresh_all_leaderboards();`
- Check slow queries: `SELECT * FROM slow_queries;`

## Next Steps

After running migrations:

1. **Seed Challenge Data** - Use API endpoint or script
2. **Create Test User** - Via API or SQL
3. **Initialize Leaderboards** - Run `refresh_all_leaderboards()`
4. **Test Prerequisites** - Verify challenge unlock logic
5. **Monitor Performance** - Watch query performance

## Schema Diagram

```
users (1) ────────── (1) user_stats
  │
  ├─ (1:N) ─ user_challenge_progress ─ (N:1) ─ challenges ─ (1:N) ─ challenge_levels
  │               │
  │               └─ (1:N) ─ level_attempts
  │
  ├─ (1:N) ─ user_track_progress ─ (N:1) ─ learning_tracks
  │
  ├─ (1:N) ─ xp_transactions
  │
  ├─ (1:N) ─ user_achievements ─ (N:1) ─ achievements
  │
  ├─ (1:N) ─ user_skills ─ (N:1) ─ skills
  │
  └─ (1:N) ─ leaderboard_entries
```

## Resources

- [PROGRESSIVE_FLOW_DATABASE_SCHEMA.md](../../../PROGRESSIVE_FLOW_DATABASE_SCHEMA.md) - Full schema documentation
- [GAMIFICATION_FORMULAS.md](../../../GAMIFICATION_FORMULAS.md) - XP and leveling formulas
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## Support

For issues or questions:
1. Check migration status
2. Review error logs
3. Verify environment configuration
4. Check PostgreSQL logs