# Progressive Flow Backend API Documentation

## Overview

The Progressive Flow API provides endpoints for managing user progress, challenges, achievements, leaderboards, and skills in the system design learning platform. All endpoints return JSON responses.

## Base URL

```
http://localhost:3001/api/progressive
```

## Response Format

All API responses follow this format:

```typescript
{
  success: boolean;
  data?: any;        // Response data (present on success)
  error?: string;    // Error message (present on failure)
}
```

## Authentication

Currently, the API uses user IDs in the URL path. Future versions may implement JWT or session-based authentication.

---

## API Endpoints

### Health Check

#### `GET /health`

Check if the Progressive Flow service is healthy.

**Response:**
```json
{
  "success": true,
  "service": "progressive-flow",
  "status": "healthy",
  "timestamp": "2025-11-22T13:00:00.000Z"
}
```

---

## User Progress Endpoints

### Get User Progress

#### `GET /user/:userId/progress`

Get complete user progress including stats, challenges, achievements, and skills.

**Parameters:**
- `userId` (path) - User ID

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "user_123",
    "stats": {
      "totalXP": 1500,
      "currentLevel": 5,
      "totalChallengesStarted": 10,
      "totalChallengesCompleted": 5,
      "totalLevelsCompleted": 25,
      "totalTimeSpentMinutes": 300,
      "currentStreakDays": 7,
      "longestStreakDays": 14,
      "lastActivityDate": "2025-11-22",
      "rankPercentile": 75.5
    },
    "challenges": [...],
    "achievements": [...],
    "skills": [...],
    "streak": {
      "currentStreak": 7,
      "longestStreak": 14,
      "lastActivityDate": "2025-11-22",
      "isActiveToday": true
    }
  }
}
```

---

### Complete Level

#### `POST /user/:userId/complete-level`

Mark a challenge level as completed and award XP.

**Parameters:**
- `userId` (path) - User ID

**Request Body:**
```json
{
  "challengeId": "challenge_uuid",
  "level": 1,
  "performance": {
    "score": 95,
    "timeSpentMinutes": 30,
    "hintsUsed": 1,
    "designSnapshot": {},
    "testResults": {}
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "success": true,
    "xpEarned": 150,
    "levelUp": true,
    "newLevel": 6,
    "achievementsUnlocked": ["first_challenge"]
  }
}
```

---

### Save Assessment

#### `POST /user/:userId/assessment`

Save assessment results and get skill level recommendations.

**Parameters:**
- `userId` (path) - User ID

**Request Body:**
```json
{
  "answers": {
    "question1": "answer1",
    "question2": "answer2"
  },
  "score": 75
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "skillLevel": "intermediate",
    "recommendedTrack": "concepts",
    "challengeRecommendations": ["challenge1", "challenge2", "challenge3"]
  }
}
```

---

## Challenge Endpoints

### Get All Challenges

#### `GET /challenges`

Get all active challenges, optionally filtered by track.

**Query Parameters:**
- `trackId` (optional) - Filter by learning track UUID

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "slug": "url-shortener",
      "title": "URL Shortener",
      "description": "Design a URL shortening service",
      "category": "caching",
      "trackId": "track_uuid",
      "orderInTrack": 1,
      "difficultyBase": "beginner",
      "xpBase": 100,
      "estimatedMinutes": 45,
      "prerequisites": [],
      "ddiaConcepts": ["caching", "hashing"],
      "tags": ["caching", "scalability"],
      "metadata": {},
      "isActive": true,
      "levels": [
        {
          "id": "level_uuid",
          "challengeId": "uuid",
          "levelNumber": 1,
          "levelName": "Connectivity",
          "description": "Basic architecture",
          "requirements": {},
          "testCases": {},
          "passingCriteria": {},
          "xpReward": 100,
          "hints": ["hint1", "hint2"],
          "solutionApproach": "...",
          "estimatedMinutes": 15
        }
      ]
    }
  ]
}
```

---

## XP Calculation

XP is calculated using the following formula:

```
Base XP = [100, 150, 200, 250, 300] (for levels 1-5)

Performance Multiplier:
- 100% score: 1.5x
- 90-99% score: 1.25x
- 75-89% score: 1.0x
- 60-74% score: 0.75x
- <60% score: 0x (no XP)

Penalties:
- Each hint used: -10% (minimum 50%)
- Solution viewed: -50%

Streak Bonus:
- 0 days: 1.0x
- 1-3 days: 1.1x
- 4-7 days: 1.25x
- 8-14 days: 1.5x
- 15-30 days: 1.75x
- 30+ days: 2.0x

Final XP = floor(Base XP × Performance × Penalty × Streak)
```

For complete API documentation, see the full endpoint list above.

## Support

For issues or questions, please refer to:
- Database Schema: `PROGRESSIVE_FLOW_DATABASE_SCHEMA.md`
- Implementation Plan: `PROGRESSIVE_FLOW_IMPLEMENTATION_PLAN.md`
- Gamification Formulas: `GAMIFICATION_FORMULAS.md`