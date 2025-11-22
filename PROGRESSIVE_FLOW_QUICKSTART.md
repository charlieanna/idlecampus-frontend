# Progressive Flow Quick Start Guide

## What is Progressive Flow?

Progressive Flow is a gamified, structured learning path for system design that runs alongside the traditional catalog view. Think of it as "System Design RPG" - you level up, earn XP, unlock achievements, and progress through carefully curated tracks.

## Quick Access

### Option 1: From Classic View
1. Go to `/system-design`
2. Click the **"🚀 Try Progressive Flow"** button (top right, next to "📚 Study Lessons")

### Option 2: Direct URL
Navigate directly to: `/system-design/progressive`

### Switching Back
Click **"← Classic View"** in the Progressive Dashboard header

---

## First-Time Setup (Optional)

### Take the Assessment
1. On the Progressive Dashboard, you'll see a blue banner: "Take the Entry Assessment"
2. Click **"Start Assessment"**
3. Answer 10 quick questions about system design concepts
4. Get personalized recommendations based on your skill level

**Note**: The assessment is optional. You can skip it and start with any track.

---

## How to Use Progressive Flow

### Step 1: Choose a Track

Three learning tracks are available:

| Track | Icon | Focus | Best For |
|-------|------|-------|----------|
| **Fundamentals** | 🎯 | Core concepts, basic patterns | Beginners, refresher |
| **Concepts** | 🚀 | Advanced patterns, distributed systems | Intermediate learners |
| **Systems** | ⚡ | Production-grade systems | Advanced learners |

Click on any track card to see available challenges.

### Step 2: Select a Challenge

Challenges are organized by track. Some may be **locked** (🔒) until you complete prerequisites.

**Example**:
- TinyURL is unlocked by default (entry point)
- Pastebin requires TinyURL completion
- Instagram requires TinyURL + Pastebin

### Step 3: Complete Levels

Each challenge has **5 levels**:

1. **Connectivity** - Build basic functionality
2. **Capacity** - Handle scale and performance
3. **Optimization** - Optimize for efficiency
4. **Resilience** - Add fault tolerance
5. **Excellence** - Perfect implementation with cost optimization

Complete levels sequentially. Each level earns XP!

### Step 4: Earn XP and Level Up

- **XP Rewards**: Each level completion earns XP (100-600 XP per level)
- **Leveling**: Accumulate XP to increase your overall level (1-50+)
- **Multipliers**: 
  - Beginner challenges: 1.0x XP
  - Intermediate: 1.5x XP
  - Advanced: 2.0x XP

### Step 5: Unlock Achievements

Achievements unlock automatically:
- 🎯 Complete your first challenge
- 🔥 Maintain a 7-day streak
- 🚀 Complete a challenge in under 30 minutes
- 💯 Perfect score on all 5 levels
- 🏆 Complete an entire track

View all achievements at `/system-design/progressive/achievements`

---

## Key Pages

### Dashboard (`/system-design/progressive`)
- Your progress overview
- Track selection
- Recent achievements
- Platform statistics

### Track Detail (`/system-design/progressive/track/:trackId`)
- All challenges in a track
- Prerequisites and unlock status
- Progress percentage

### Challenge Detail (`/system-design/progressive/challenge/:id`)
- Challenge description and requirements
- 5-level breakdown
- Your progress on each level
- Hints and DDIA references

### Skill Tree (`/system-design/progressive/skills`)
- Visual map of all challenges
- Prerequisite chains
- Locked vs unlocked challenges

### Leaderboard (`/system-design/progressive/leaderboard`)
- Weekly, monthly, all-time rankings
- Track-specific leaderboards
- (Currently mock data)

### Profile (`/system-design/progressive/profile`)
- Your statistics
- XP breakdown
- Strengths and weaknesses
- Learning patterns

### Progress Dashboard (`/system-design/progressive/progress`)
- Detailed analytics
- Time tracking
- Completion rates
- Streak history

---

## Testing the Flow

### Quick Test (5 minutes)

1. **Navigate** to `/system-design/progressive`
2. **Skip assessment** (or take it if you want)
3. **Click** on the Fundamentals track (🎯)
4. **Select** TinyURL challenge
5. **Complete** Level 1 (Connectivity)
6. **Check** your XP gain notification
7. **View** your progress on the dashboard

### Full Test (30 minutes)

1. Take the assessment
2. Complete TinyURL all 5 levels
3. Check unlocked achievements
4. View skill tree to see unlocked challenges
5. Start Pastebin (unlocked after TinyURL)
6. Check leaderboard position
7. Review profile analytics

---

## Navigation Map

```
/system-design (Classic Catalog)
    ↓
    Click "🚀 Try Progressive Flow"
    ↓
/system-design/progressive (Dashboard)
    ├── Take Assessment → /progressive/assessment
    ├── Click Track → /progressive/track/:trackId
    │   └── Click Challenge → /progressive/challenge/:id
    ├── View Skills → /progressive/skills
    ├── View Achievements → /progressive/achievements
    ├── View Leaderboard → /progressive/leaderboard
    ├── View Profile → /progressive/profile
    └── View Progress → /progressive/progress
```

---

## Known Limitations

1. **Browser-specific**: Progress is saved in localStorage (not synced across devices)
2. **No authentication**: No login required, but also no cloud backup
3. **Mock leaderboards**: Leaderboard data is simulated
4. **Static prerequisites**: Prerequisite chains are predefined

---

## Coexistence with Classic View

Both views work independently:

| Feature | Classic View | Progressive Flow |
|---------|--------------|------------------|
| Challenge access | All 61+ challenges | Same 61+ challenges |
| Filtering | Difficulty, category | Track, prerequisites |
| Progress tracking | None | XP, levels, achievements |
| Navigation | Browse catalog | Guided progression |
| Data source | `tieredChallenges` | Same `tieredChallenges` |
| Routes | `/system-design/*` | `/system-design/progressive/*` |

**You can freely switch between them without losing progress!**

---

## Troubleshooting

### "Challenge is locked 🔒"
- Complete prerequisite challenges first
- Check prerequisites in the challenge card
- View the skill tree to see the unlock path

### "No XP after completing level"
- Ensure you completed the level successfully
- Check the progress dashboard for XP history
- Refresh the page if needed (localStorage sync)

### "Assessment won't start"
- Assessment is optional - you can skip it
- Refresh the page if stuck
- Start with Fundamentals track directly

### "Progress disappeared"
- Check if you're in the same browser
- localStorage is browser-specific
- Don't clear browser data

---

## Next Steps

After completing this quick start:

1. **Read the full README**: `src/apps/system-design/progressive/README.md`
2. **Review implementation plan**: `PROGRESSIVE_FLOW_IMPLEMENTATION_PLAN.md`
3. **Check UI mockups**: `PROGRESSIVE_FLOW_WIREFRAMES.md`
4. **Explore database schema**: `PROGRESSIVE_FLOW_DATABASE_SCHEMA.md` (for future backend)

---

## Quick Reference

**Routes:**
- Classic: `/system-design`
- Progressive: `/system-design/progressive`
- Lessons: `/system-design/lessons`

**Toggle:**
- Classic → Progressive: Click "🚀 Try Progressive Flow"
- Progressive → Classic: Click "← Classic View"

**Tracks:**
- 🎯 Fundamentals (40h, beginner)
- 🚀 Concepts (50h, intermediate)
- ⚡ Systems (60h, advanced)

**Levels:**
1. Connectivity (100 XP base)
2. Capacity (150 XP base)
3. Optimization (200 XP base)
4. Resilience (250 XP base)
5. Excellence (300 XP base)

---

**Happy Learning! 🚀**

For detailed documentation, see `src/apps/system-design/progressive/README.md`