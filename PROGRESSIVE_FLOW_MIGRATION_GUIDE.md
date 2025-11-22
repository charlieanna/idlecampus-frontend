# System Design Course → Progressive Flow Migration Guide

## Overview

This guide explains how to convert your existing system design course into a gamified progressive flow learning system using the Rails backend that's already implemented.

## Current State Analysis

### ✅ Already Implemented

**Rails Backend (`../backend`)**:
- ✅ Models: `ProgressiveChallenge`, `ProgressiveUserChallengeProgress`, `ProgressiveUserStat`
- ✅ Controllers: `ProgressiveChallengesController`, `ProgressiveUsersController`, `ProgressiveLeaderboardsController`
- ✅ API Routes: `/api/v1/progressive/*` endpoints (lines 384-459 in routes.rb)
- ✅ Database schema with 17 tables for gamification

**React Frontend (`src/apps/system-design/progressive/`)**:
- ✅ UI Components: Assessment, Dashboard, Leaderboard, Skill Tree, Challenge pages
- ✅ API Client: `apiClient.ts` with full backend integration
- ✅ Progress Service: `progressServiceBackend.ts` with localStorage fallback
- ✅ Type definitions: Complete TypeScript interfaces

**Documentation**:
- ✅ `PROGRESSIVE_FLOW_DATABASE_SCHEMA.md` - Database design
- ✅ `GAMIFICATION_FORMULAS.md` - XP and reward calculations
- ✅ `README_PROGRESSIVE_FLOW_RAILS.md` - Rails backend documentation

---

## What's Missing: Data Migration

The key missing piece is **converting your existing system design course data into the progressive flow format**. You need to:

1. **Identify your existing system design challenges**
2. **Map them to the 61-challenge progressive structure**
3. **Create database seed data**
4. **Define the 5 levels for each challenge**
5. **Set up prerequisite chains**

---

## Step-by-Step Migration Process

### Step 1: Analyze Existing System Design Data

First, let's examine what system design data you currently have:

```bash
# Check existing system design course files
ls -la src/data/systemDesign/
ls -la public/data/systemDesign/

# Check database for existing challenges
cd ../backend
rails console
> Challenge.where(category: 'system-design').count
> Challenge.where(category: 'system-design').pluck(:slug, :title)
```

### Step 2: Create Progressive Challenge Seed Data

Create a seed file that defines the 61 progressive challenges:

**File**: `../backend/db/seeds/progressive_challenges.rb`

```ruby
# Progressive Flow System Design Challenges Seed Data
# 61 challenges across 3 tracks with 5 levels each

# Clear existing data (optional - be careful in production!)
# ProgressiveChallenge.destroy_all
# ProgressiveLearningTrack.destroy_all

# ==================== Learning Tracks ====================

fundamentals_track = ProgressiveLearningTrack.create!(
  slug: 'fundamentals',
  name: 'System Design Fundamentals',
  description: 'Master the building blocks of distributed systems',
  difficulty_level: 'fundamentals',
  estimated_hours: 40,
  order_index: 1,
  is_active: true
)

concepts_track = ProgressiveLearningTrack.create!(
  slug: 'concepts',
  name: 'Advanced Concepts',
  description: 'Deep dive into complex system design patterns',
  difficulty_level: 'concepts',
  estimated_hours: 60,
  order_index: 2,
  is_active: true,
  prerequisites: [fundamentals_track.id]
)

systems_track = ProgressiveLearningTrack.create!(
  slug: 'systems',
  name: 'Real-World Systems',
  description: 'Design production-grade distributed systems',
  difficulty_level: 'systems',
  estimated_hours: 80,
  order_index: 3,
  is_active: true,
  prerequisites: [concepts_track.id]
)

# ==================== Fundamentals Track Challenges (20) ====================

# Challenge 1: URL Shortener (No Prerequisites)
url_shortener = ProgressiveChallenge.create!(
  slug: 'url-shortener',
  title: 'URL Shortener',
  description: 'Design a scalable URL shortening service like bit.ly',
  category: 'storage',
  progressive_learning_track: fundamentals_track,
  order_in_track: 1,
  difficulty_base: 'beginner',
  xp_base: 100,
  estimated_minutes: 30,
  prerequisites: [],
  ddia_concepts: ['hashing', 'key-value stores'],
  tags: ['beginner', 'storage', 'hashing'],
  is_active: true
)

# Challenge 2: Key-Value Store (Requires URL Shortener)
kv_store = ProgressiveChallenge.create!(
  slug: 'key-value-store',
  title: 'Key-Value Store',
  description: 'Build a distributed key-value storage system',
  category: 'storage',
  progressive_learning_track: fundamentals_track,
  order_in_track: 2,
  difficulty_base: 'beginner',
  xp_base: 150,
  estimated_minutes: 45,
  prerequisites: [url_shortener.id],
  ddia_concepts: ['storage', 'replication'],
  tags: ['storage', 'database'],
  is_active: true
)

# Challenge 3: Rate Limiter
rate_limiter = ProgressiveChallenge.create!(
  slug: 'rate-limiter',
  title: 'Rate Limiter',
  description: 'Design an API rate limiting system',
  category: 'gateway',
  progressive_learning_track: fundamentals_track,
  order_in_track: 3,
  difficulty_base: 'beginner',
  xp_base: 120,
  estimated_minutes: 40,
  prerequisites: [kv_store.id],
  ddia_concepts: ['throttling', 'caching'],
  tags: ['gateway', 'caching'],
  is_active: true
)

# ... Continue for all 61 challenges ...

# ==================== Concepts Track Challenges (21) ====================

# Challenge 21: Distributed Cache
distributed_cache = ProgressiveChallenge.create!(
  slug: 'distributed-cache',
  title: 'Distributed Cache',
  description: 'Design a Redis-like distributed caching system',
  category: 'caching',
  progressive_learning_track: concepts_track,
  order_in_track: 1,
  difficulty_base: 'intermediate',
  xp_base: 200,
  estimated_minutes: 60,
  prerequisites: [rate_limiter.id], # Last challenge from fundamentals
  ddia_concepts: ['caching', 'consistency'],
  tags: ['caching', 'distributed'],
  is_active: true
)

# ... Continue for concepts track ...

# ==================== Systems Track Challenges (20) ====================

# Challenge 42: Design YouTube
youtube = ProgressiveChallenge.create!(
  slug: 'design-youtube',
  title: 'Design YouTube',
  description: 'Build a video streaming platform at scale',
  category: 'streaming',
  progressive_learning_track: systems_track,
  order_in_track: 1,
  difficulty_base: 'advanced',
  xp_base: 300,
  estimated_minutes: 90,
  prerequisites: [distributed_cache.id], # Last from concepts
  ddia_concepts: ['streaming', 'cdn', 'storage'],
  tags: ['streaming', 'cdn', 'advanced'],
  is_active: true
)

# ... Continue for systems track ...

puts "✅ Created #{ProgressiveLearningTrack.count} learning tracks"
puts "✅ Created #{ProgressiveChallenge.count} progressive challenges"
puts "✅ Created #{ProgressiveChallengeLevel.count} challenge levels (5 per challenge)"
```

### Step 3: Define the 5 Levels for Each Challenge

The `ProgressiveChallenge` model automatically creates 5 levels when a challenge is created (see `create_default_levels` callback). However, you need to populate the level-specific data:

**Create a migration to update level data**:

```bash
cd ../backend
rails generate migration PopulateProgressiveChallengeLevels
```

**File**: `../backend/db/migrate/XXXXXX_populate_progressive_challenge_levels.rb`

```ruby
class PopulateProgressiveChallengeLevels < ActiveRecord::Migration[7.0]
  def up
    # URL Shortener Levels
    url_shortener = ProgressiveChallenge.find_by(slug: 'url-shortener')
    
    url_shortener.progressive_challenge_levels.find_by(level_number: 1).update!(
      description: 'Create a basic URL shortening mechanism with a database',
      requirements: {
        components: ['API', 'Database'],
        connections: ['API -> Database']
      },
      test_cases: {
        scenarios: [
          { name: 'Shorten URL', input: 'https://example.com', expected: 'short code generated' },
          { name: 'Resolve URL', input: 'abc123', expected: 'original URL returned' }
        ]
      },
      passing_criteria: {
        min_score: 60,
        required_components: ['API', 'Database'],
        required_connections: 1
      },
      hints: [
        'Use a hash function to generate short codes',
        'Store mappings in a key-value database'
      ],
      solution_approach: 'Use base62 encoding of auto-incremented IDs for short codes'
    )
    
    url_shortener.progressive_challenge_levels.find_by(level_number: 2).update!(
      description: 'Add caching to improve read performance',
      requirements: {
        components: ['API', 'Cache', 'Database'],
        connections: ['API -> Cache', 'Cache -> Database']
      },
      # ... similar structure for level 2
    )
    
    # Continue for levels 3, 4, 5 ...
    
    # Repeat for all 61 challenges ...
  end
  
  def down
    # Revert if needed
  end
end
```

### Step 4: Create Achievements

**File**: `../backend/db/seeds/progressive_achievements.rb`

```ruby
# Gamification: Achievements

# First Steps
ProgressiveAchievement.create!(
  slug: 'first-challenge',
  name: 'First Steps',
  description: 'Complete your first challenge',
  icon_url: '🎯',
  category: 'milestone',
  rarity: 'common',
  xp_reward: 50,
  criteria: { challenges_completed: 1 },
  is_active: true
)

# Milestone achievements
[10, 25, 50, 61].each do |count|
  ProgressiveAchievement.create!(
    slug: "challenges-#{count}",
    name: "#{count} Challenges",
    description: "Complete #{count} challenges",
    icon_url: '🏆',
    category: 'milestone',
    rarity: count >= 50 ? 'legendary' : (count >= 25 ? 'epic' : 'rare'),
    xp_reward: count * 10,
    criteria: { challenges_completed: count },
    is_active: true
  )
end

# Streak achievements
[3, 7, 14, 30].each do |days|
  ProgressiveAchievement.create!(
    slug: "streak-#{days}",
    name: "#{days} Day Streak",
    description: "Learn for #{days} consecutive days",
    icon_url: '🔥',
    category: 'streak',
    rarity: days >= 30 ? 'legendary' : (days >= 14 ? 'epic' : 'rare'),
    xp_reward: days * 20,
    criteria: { streak_days: days },
    is_active: true
  )
end

puts "✅ Created #{ProgressiveAchievement.count} achievements"
```

### Step 5: Create Skills

**File**: `../backend/db/seeds/progressive_skills.rb`

```ruby
# Skill Tree

# Core Skills
caching_skill = ProgressiveSkill.create!(
  slug: 'caching-mastery',
  name: 'Caching Mastery',
  description: 'Master caching strategies and patterns',
  category: 'core',
  max_level: 5,
  xp_per_level: 100
)

database_skill = ProgressiveSkill.create!(
  slug: 'database-design',
  name: 'Database Design',
  description: 'Design scalable database architectures',
  category: 'core',
  max_level: 5,
  xp_per_level: 100
)

# Advanced Skills (require prerequisites)
distributed_systems = ProgressiveSkill.create!(
  slug: 'distributed-systems',
  name: 'Distributed Systems',
  description: 'Build distributed architectures',
  category: 'advanced',
  parent_skill_id: database_skill.id,
  prerequisites: [caching_skill.id, database_skill.id],
  max_level: 5,
  xp_per_level: 150
)

puts "✅ Created #{ProgressiveSkill.count} skills"
```

### Step 6: Run Seeds and Migrations

```bash
cd ../backend

# Run migrations
rails db:migrate

# Run all seeds
rails db:seed

# Or run specific seed files
rails runner db/seeds/progressive_challenges.rb
rails runner db/seeds/progressive_achievements.rb
rails runner db/seeds/progressive_skills.rb

# Verify data
rails console
> ProgressiveChallenge.count  # Should be 61
> ProgressiveChallengeLevel.count  # Should be 305 (61 * 5)
> ProgressiveAchievement.count
> ProgressiveSkill.count
```

### Step 7: Connect Frontend to Backend

Update your frontend environment configuration:

**File**: `frontend/.env.local`

```env
# Progressive Flow Backend
VITE_PROGRESSIVE_FLOW_USE_BACKEND=true
VITE_PROGRESSIVE_FLOW_API_URL=http://localhost:3000
```

### Step 8: Test the Integration

```bash
# Terminal 1: Start Rails backend
cd ../backend
rails server

# Terminal 2: Start React frontend
cd frontend
npm run dev
```

Navigate to `http://localhost:5173/system-design/progressive` and test:

1. ✅ Assessment page loads
2. ✅ Dashboard shows challenges from Rails backend
3. ✅ Completing a level awards XP
4. ✅ Achievements unlock automatically
5. ✅ Leaderboard displays rankings
6. ✅ Skill tree shows progress

---

## Mapping Existing Data Strategy

If you already have system design challenges in your database, create a migration script:

**File**: `../backend/lib/tasks/migrate_to_progressive.rake`

```ruby
namespace :progressive do
  desc "Migrate existing challenges to progressive format"
  task migrate: :environment do
    # Find existing system design challenges
    existing_challenges = Challenge.where(category: 'system-design')
    
    puts "Found #{existing_challenges.count} existing challenges"
    
    existing_challenges.each_with_index do |challenge, index|
      # Create progressive challenge
      progressive = ProgressiveChallenge.create!(
        slug: challenge.slug,
        title: challenge.title,
        description: challenge.description,
        category: challenge.category,
        order_in_track: index + 1,
        difficulty_base: map_difficulty(challenge.difficulty),
        xp_base: 100,
        estimated_minutes: 30,
        prerequisites: [],
        is_active: true
      )
      
      # Levels are auto-created by callback
      # Now update them with real data
      progressive.progressive_challenge_levels.each do |level|
        level.update!(
          description: "Level #{level.level_number} description",
          requirements: extract_requirements(challenge, level.level_number),
          test_cases: extract_test_cases(challenge, level.level_number),
          passing_criteria: { min_score: 60 }
        )
      end
      
      puts "✓ Migrated: #{challenge.title}"
    end
  end
  
  def map_difficulty(old_difficulty)
    case old_difficulty
    when 'easy' then 'beginner'
    when 'medium' then 'intermediate'
    when 'hard' then 'advanced'
    else 'beginner'
    end
  end
  
  def extract_requirements(challenge, level_number)
    # Extract from existing challenge data
    # This depends on your current data structure
    {}
  end
  
  def extract_test_cases(challenge, level_number)
    # Extract test scenarios
    {}
  end
end
```

Run the migration:

```bash
rails progressive:migrate
```

---

## Verification Checklist

### Backend

- [ ] Rails server running on port 3000
- [ ] `/api/v1/progressive/challenges` returns 61 challenges
- [ ] Each challenge has 5 levels
- [ ] Prerequisites are correctly set
- [ ] Achievements are seeded
- [ ] Skills are seeded

### Frontend

- [ ] Environment variable `VITE_PROGRESSIVE_FLOW_USE_BACKEND=true` is set
- [ ] API client connects successfully
- [ ] Dashboard loads challenges from backend
- [ ] Challenge detail page shows 5 levels
- [ ] Level completion awards XP
- [ ] User stats update in real-time
- [ ] Leaderboard works
- [ ] Achievements unlock

### Database

```sql
-- Verify data
SELECT 'Challenges', COUNT(*) FROM progressive_challenges UNION ALL
SELECT 'Levels', COUNT(*) FROM progressive_challenge_levels UNION ALL
SELECT 'Achievements', COUNT(*) FROM progressive_achievements UNION ALL
SELECT 'Skills', COUNT(*) FROM progressive_skills;

-- Check first challenge with levels
SELECT c.title, cl.level_number, cl.level_name, cl.xp_reward
FROM progressive_challenges c
JOIN progressive_challenge_levels cl ON cl.progressive_challenge_id = c.id
WHERE c.slug = 'url-shortener'
ORDER BY cl.level_number;
```

---

## Quick Start Template

If you want to get started quickly with a minimal setup:

```bash
# 1. Create minimal seed data
cd ../backend
cat > db/seeds/progressive_minimal.rb << 'EOF'
# Minimal Progressive Flow Setup

track = ProgressiveLearningTrack.create!(
  slug: 'fundamentals',
  name: 'System Design Fundamentals',
  description: 'Core concepts',
  difficulty_level: 'fundamentals',
  estimated_hours: 40,
  order_index: 1,
  is_active: true
)

# Create 5 starter challenges
['URL Shortener', 'Rate Limiter', 'Cache System', 'Message Queue', 'Load Balancer'].each_with_index do |title, i|
  ProgressiveChallenge.create!(
    slug: title.parameterize,
    title: title,
    description: "Design a #{title}",
    category: 'fundamentals',
    progressive_learning_track: track,
    order_in_track: i + 1,
    difficulty_base: 'beginner',
    xp_base: 100,
    estimated_minutes: 30,
    prerequisites: [],
    is_active: true
  )
end

puts "✅ Created #{ProgressiveChallenge.count} challenges"
EOF

# 2. Run seeds
rails runner db/seeds/progressive_minimal.rb

# 3. Start backend
rails server

# 4. Configure frontend (in separate terminal)
cd frontend
echo "VITE_PROGRESSIVE_FLOW_USE_BACKEND=true" >> .env.local
echo "VITE_PROGRESSIVE_FLOW_API_URL=http://localhost:3000" >> .env.local
npm run dev
```

---

## Next Steps

1. **Populate all 61 challenges** - Use the template above
2. **Define level requirements** - Create detailed requirements for each level
3. **Set up prerequisites** - Create the dependency chain
4. **Add real test cases** - Define validation logic for designs
5. **Configure DDIA mappings** - Link challenges to "Designing Data-Intensive Applications" concepts
6. **Deploy** - Set up production environment

---

## Troubleshooting

### Backend Issues

**Problem**: API returns empty challenges
```bash
# Check Rails console
rails console
> ProgressiveChallenge.count
> ProgressiveChallenge.first
```

**Problem**: CORS errors
```ruby
# In config/initializers/cors.rb
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins 'http://localhost:5173'
    resource '/api/*', headers: :any, methods: [:get, :post, :patch, :put, :delete, :options]
  end
end
```

### Frontend Issues

**Problem**: API client not connecting
```javascript
// Check browser console for:
// [API] GET /api/progressive/challenges
// [API] Response: 200

// Verify environment variable
console.log(import.meta.env.VITE_PROGRESSIVE_FLOW_USE_BACKEND)
console.log(import.meta.env.VITE_PROGRESSIVE_FLOW_API_URL)
```

---

## Summary

Your progressive flow system is already 90% implemented! You just need to:

1. ✅ **Seed the database** with 61 challenges
2. ✅ **Define the 5 levels** for each challenge  
3. ✅ **Set prerequisites** to create the learning path
4. ✅ **Configure frontend** to use backend API
5. ✅ **Test integration** end-to-end

The Rails backend, React frontend, and all infrastructure are ready to go. Follow the steps above to complete the migration!
