# Gamification Formulas & Mechanics

## XP (Experience Points) System

### Base XP Calculation

#### Per Level Completion
```javascript
function calculateLevelXP(level, baseXP, performance) {
  const levelMultiplier = {
    1: 1.0,   // Connectivity
    2: 1.5,   // Capacity  
    3: 2.0,   // Optimization
    4: 2.5,   // Resilience
    5: 3.0    // Excellence
  };
  
  const performanceMultiplier = {
    perfect: 1.5,      // 100% score
    excellent: 1.25,   // 90-99%
    good: 1.0,         // 75-89%
    pass: 0.75,        // 60-74%
    fail: 0           // <60%
  };
  
  const timeBonus = calculateTimeBonus(completionTime, estimatedTime);
  const streakBonus = calculateStreakBonus(currentStreak);
  
  return Math.floor(
    baseXP * 
    levelMultiplier[level] * 
    performanceMultiplier[performance] * 
    timeBonus * 
    streakBonus
  );
}
```

#### Time Bonus Calculation
```javascript
function calculateTimeBonus(actualTime, estimatedTime) {
  const ratio = actualTime / estimatedTime;
  
  if (ratio <= 0.5) return 2.0;      // Completed in half time or less
  if (ratio <= 0.75) return 1.5;     // 25% faster
  if (ratio <= 1.0) return 1.25;     // On time
  if (ratio <= 1.25) return 1.0;     // 25% slower
  if (ratio <= 1.5) return 0.9;      // 50% slower
  return 0.8;                         // More than 50% slower
}
```

#### Streak Bonus
```javascript
function calculateStreakBonus(streakDays) {
  if (streakDays === 0) return 1.0;
  if (streakDays <= 3) return 1.1;
  if (streakDays <= 7) return 1.25;
  if (streakDays <= 14) return 1.5;
  if (streakDays <= 30) return 1.75;
  return 2.0; // 30+ days
}
```

### XP Penalties

```javascript
function applyPenalties(baseXP, hintsUsed, solutionViewed, retries) {
  let penaltyMultiplier = 1.0;
  
  // Hint penalties (cumulative)
  const hintPenalty = {
    1: 0.9,   // -10% for first hint
    2: 0.8,   // -20% for second hint
    3: 0.7,   // -30% for third hint
    max: 0.5  // -50% for 4+ hints
  };
  
  if (hintsUsed > 0) {
    penaltyMultiplier *= hintPenalty[Math.min(hintsUsed, 'max')];
  }
  
  // Solution viewing penalty
  if (solutionViewed) {
    penaltyMultiplier *= 0.5; // -50% for viewing solution
  }
  
  // Retry penalty (for same level)
  if (retries > 0) {
    penaltyMultiplier *= Math.max(0.5, 1 - (retries * 0.1)); // -10% per retry, min 50%
  }
  
  return Math.floor(baseXP * penaltyMultiplier);
}
```

## Level Progression System

### User Level Calculation
```javascript
function calculateUserLevel(totalXP) {
  // Quadratic progression: XP required increases with level
  // Level N requires: 100 * N * (N + 1) / 2 total XP
  
  // Inverse formula to get level from XP
  const level = Math.floor((-1 + Math.sqrt(1 + 8 * totalXP / 100)) / 2) + 1;
  return Math.max(1, level);
}

function getXPForLevel(level) {
  return 100 * level * (level + 1) / 2;
}

function getXPProgressInCurrentLevel(totalXP) {
  const currentLevel = calculateUserLevel(totalXP);
  const xpForCurrentLevel = getXPForLevel(currentLevel - 1);
  const xpForNextLevel = getXPForLevel(currentLevel);
  
  const xpInLevel = totalXP - xpForCurrentLevel;
  const xpNeeded = xpForNextLevel - xpForCurrentLevel;
  
  return {
    level: currentLevel,
    xpInLevel: xpInLevel,
    xpNeeded: xpNeeded,
    progress: (xpInLevel / xpNeeded) * 100
  };
}
```

### Rank System
```javascript
const RANKS = [
  { name: 'Novice', minLevel: 1, color: '#808080' },
  { name: 'Apprentice', minLevel: 5, color: '#CD7F32' },
  { name: 'Bronze I', minLevel: 10, color: '#CD7F32' },
  { name: 'Bronze II', minLevel: 15, color: '#CD7F32' },
  { name: 'Bronze III', minLevel: 20, color: '#CD7F32' },
  { name: 'Silver I', minLevel: 25, color: '#C0C0C0' },
  { name: 'Silver II', minLevel: 30, color: '#C0C0C0' },
  { name: 'Silver III', minLevel: 35, color: '#C0C0C0' },
  { name: 'Gold I', minLevel: 40, color: '#FFD700' },
  { name: 'Gold II', minLevel: 45, color: '#FFD700' },
  { name: 'Gold III', minLevel: 50, color: '#FFD700' },
  { name: 'Platinum I', minLevel: 60, color: '#E5E4E2' },
  { name: 'Platinum II', minLevel: 70, color: '#E5E4E2' },
  { name: 'Platinum III', minLevel: 80, color: '#E5E4E2' },
  { name: 'Diamond', minLevel: 90, color: '#B9F2FF' },
  { name: 'Master', minLevel: 100, color: '#FF4500' },
  { name: 'Grandmaster', minLevel: 150, color: '#FF1493' }
];

function getUserRank(level) {
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (level >= RANKS[i].minLevel) {
      return RANKS[i];
    }
  }
  return RANKS[0];
}
```

## Challenge Unlock System

### Prerequisite Calculation
```javascript
function checkChallengeUnlock(challenge, userProgress) {
  // Direct prerequisites
  const directPrereqs = challenge.prerequisites || [];
  const allDirectMet = directPrereqs.every(prereqId => 
    userProgress[prereqId]?.status === 'completed'
  );
  
  // Level-based unlock
  const userLevel = calculateUserLevel(userProgress.totalXP);
  const levelRequirement = getMinLevelForChallenge(challenge);
  const levelMet = userLevel >= levelRequirement;
  
  // Track completion requirement
  const trackRequirement = getTrackRequirement(challenge);
  const trackMet = !trackRequirement || 
    userProgress.tracks[trackRequirement]?.progress >= 0.5; // 50% of track
  
  // Skill point requirement
  const skillRequirement = getSkillRequirement(challenge);
  const skillMet = !skillRequirement ||
    userProgress.skills[skillRequirement]?.level >= 1;
  
  return {
    unlocked: allDirectMet && levelMet && trackMet && skillMet,
    requirements: {
      prerequisites: { required: directPrereqs, met: allDirectMet },
      level: { required: levelRequirement, met: levelMet },
      track: { required: trackRequirement, met: trackMet },
      skill: { required: skillRequirement, met: skillMet }
    }
  };
}

function getMinLevelForChallenge(challenge) {
  const difficultyLevels = {
    'beginner': 1,
    'intermediate': 10,
    'advanced': 25,
    'expert': 50
  };
  return difficultyLevels[challenge.difficulty] || 1;
}
```

## Skill Tree & Points

### Skill Point Allocation
```javascript
function calculateSkillPoints(userLevel) {
  // 1 skill point every 5 levels, +1 bonus every 10 levels
  const basePoints = Math.floor(userLevel / 5);
  const bonusPoints = Math.floor(userLevel / 10);
  return basePoints + bonusPoints;
}

function allocateSkillPoint(skill, userSkills, availablePoints) {
  if (availablePoints <= 0) {
    return { success: false, error: 'No skill points available' };
  }
  
  // Check prerequisites
  const prereqsMet = skill.prerequisites.every(prereqId => 
    userSkills[prereqId]?.level >= 1
  );
  
  if (!prereqsMet) {
    return { success: false, error: 'Prerequisites not met' };
  }
  
  // Check max level
  const currentLevel = userSkills[skill.id]?.level || 0;
  if (currentLevel >= skill.maxLevel) {
    return { success: false, error: 'Skill at max level' };
  }
  
  // Allocate point
  return {
    success: true,
    newLevel: currentLevel + 1,
    remainingPoints: availablePoints - 1
  };
}
```

### Skill Mastery Bonuses
```javascript
function calculateSkillBonuses(userSkills) {
  const bonuses = {
    xpMultiplier: 1.0,
    hintCost: 1.0,
    timeExtension: 1.0,
    unlockSpeed: 1.0
  };
  
  // Each skill provides specific bonuses
  const skillEffects = {
    'caching_expert': { xpMultiplier: 0.1 },
    'database_master': { xpMultiplier: 0.15 },
    'speed_runner': { timeExtension: 0.1 },
    'hint_master': { hintCost: -0.2 },
    'unlock_specialist': { unlockSpeed: 0.2 }
  };
  
  for (const [skillId, skill] of Object.entries(userSkills)) {
    if (skillEffects[skillId] && skill.level > 0) {
      const effect = skillEffects[skillId];
      for (const [bonus, value] of Object.entries(effect)) {
        bonuses[bonus] += value * skill.level;
      }
    }
  }
  
  return bonuses;
}
```

## Achievement System

### Achievement Triggers
```javascript
const ACHIEVEMENTS = {
  // First-time achievements
  first_challenge: {
    condition: (stats) => stats.challengesCompleted >= 1,
    xp: 50,
    rarity: 'common'
  },
  first_perfect: {
    condition: (stats) => stats.perfectScores >= 1,
    xp: 100,
    rarity: 'rare'
  },
  
  // Milestone achievements
  challenge_10: {
    condition: (stats) => stats.challengesCompleted >= 10,
    xp: 200,
    rarity: 'rare'
  },
  challenge_25: {
    condition: (stats) => stats.challengesCompleted >= 25,
    xp: 500,
    rarity: 'epic'
  },
  challenge_61: {
    condition: (stats) => stats.challengesCompleted >= 61,
    xp: 2000,
    rarity: 'legendary'
  },
  
  // Streak achievements
  streak_3: {
    condition: (stats) => stats.currentStreak >= 3,
    xp: 50,
    rarity: 'common'
  },
  streak_7: {
    condition: (stats) => stats.currentStreak >= 7,
    xp: 150,
    rarity: 'rare'
  },
  streak_30: {
    condition: (stats) => stats.currentStreak >= 30,
    xp: 1000,
    rarity: 'legendary'
  },
  
  // Speed achievements
  speed_demon: {
    condition: (stats) => stats.fastCompletions >= 10,
    xp: 300,
    rarity: 'epic'
  },
  
  // Mastery achievements
  no_hints_master: {
    condition: (stats) => stats.noHintCompletions >= 5,
    xp: 500,
    rarity: 'epic'
  },
  
  // Track achievements
  fundamentals_complete: {
    condition: (stats) => stats.tracks.fundamentals === 100,
    xp: 500,
    rarity: 'rare'
  },
  concepts_complete: {
    condition: (stats) => stats.tracks.concepts === 100,
    xp: 750,
    rarity: 'epic'
  },
  systems_complete: {
    condition: (stats) => stats.tracks.systems === 100,
    xp: 1500,
    rarity: 'legendary'
  }
};

function checkAchievements(userStats, existingAchievements) {
  const newAchievements = [];
  
  for (const [id, achievement] of Object.entries(ACHIEVEMENTS)) {
    if (!existingAchievements.includes(id) && achievement.condition(userStats)) {
      newAchievements.push({
        id,
        xp: achievement.xp,
        rarity: achievement.rarity,
        unlockedAt: new Date()
      });
    }
  }
  
  return newAchievements;
}
```

## Daily Challenge System

### Challenge Selection
```javascript
function selectDailyChallenge(date, availableChallenges, recentDailies) {
  // Seed random with date for consistency
  const seed = dateToSeed(date);
  const rng = seedRandom(seed);
  
  // Filter out recent challenges (last 7 days)
  const eligible = availableChallenges.filter(c => 
    !recentDailies.includes(c.id)
  );
  
  // Weight by difficulty and popularity
  const weights = eligible.map(c => {
    const difficultyWeight = {
      'beginner': 3,
      'intermediate': 2,
      'advanced': 1
    }[c.difficulty] || 1;
    
    const popularityWeight = 1 + (c.attemptCount / 1000);
    
    return difficultyWeight * popularityWeight;
  });
  
  // Select weighted random
  return weightedRandom(eligible, weights, rng);
}

function calculateDailyBonus(baseXP, participantRank, totalParticipants) {
  const multiplier = 2.0; // Base 2x for daily challenges
  
  // Rank bonus (top performers get extra)
  let rankBonus = 0;
  if (participantRank <= 3) rankBonus = 0.5;           // Top 3: +50%
  else if (participantRank <= 10) rankBonus = 0.3;     // Top 10: +30%
  else if (participantRank <= 100) rankBonus = 0.1;    // Top 100: +10%
  
  // Participation bonus (more participants = higher bonus)
  const participationBonus = Math.min(0.5, totalParticipants / 1000);
  
  return Math.floor(baseXP * (multiplier + rankBonus + participationBonus));
}
```

## Leaderboard Scoring

### Composite Score Calculation
```javascript
function calculateLeaderboardScore(user, period) {
  const weights = {
    xp: 0.4,
    challenges: 0.3,
    streak: 0.2,
    achievements: 0.1
  };
  
  // Normalize each metric to 0-100 scale
  const normalizedScores = {
    xp: normalizeXP(user.xpEarned[period]),
    challenges: normalizeChallenges(user.challengesCompleted[period]),
    streak: normalizeStreak(user.maxStreak[period]),
    achievements: normalizeAchievements(user.achievementsUnlocked[period])
  };
  
  // Calculate weighted score
  let totalScore = 0;
  for (const [metric, weight] of Object.entries(weights)) {
    totalScore += normalizedScores[metric] * weight;
  }
  
  return Math.round(totalScore * 100);
}

function normalizeXP(xp, maxXP = 10000) {
  return Math.min(100, (xp / maxXP) * 100);
}

function normalizeChallenges(count, maxCount = 50) {
  return Math.min(100, (count / maxCount) * 100);
}

function normalizeStreak(days, maxDays = 30) {
  return Math.min(100, (days / maxDays) * 100);
}

function normalizeAchievements(count, maxCount = 20) {
  return Math.min(100, (count / maxCount) * 100);
}
```

## Adaptive Difficulty

### Dynamic Difficulty Adjustment
```javascript
function adjustChallengeLevel(userPerformance, currentLevel) {
  const recentAttempts = userPerformance.slice(-5); // Last 5 attempts
  const avgScore = average(recentAttempts.map(a => a.score));
  const avgTime = average(recentAttempts.map(a => a.completionTime));
  const failureRate = recentAttempts.filter(a => !a.passed).length / recentAttempts.length;
  
  // Performance indicators
  const struggling = avgScore < 60 || failureRate > 0.4;
  const comfortable = avgScore >= 75 && avgScore < 90 && failureRate < 0.2;
  const mastered = avgScore >= 90 && failureRate === 0;
  
  // Recommendations
  if (struggling && currentLevel > 1) {
    return {
      recommendation: 'decrease',
      suggestedLevel: currentLevel - 1,
      reason: 'High failure rate detected'
    };
  } else if (mastered && currentLevel < 5) {
    return {
      recommendation: 'increase',
      suggestedLevel: currentLevel + 1,
      reason: 'Consistent high performance'
    };
  } else {
    return {
      recommendation: 'maintain',
      suggestedLevel: currentLevel,
      reason: 'Performance is appropriate for level'
    };
  }
}
```

## Engagement Metrics

### Engagement Score
```javascript
function calculateEngagementScore(userActivity) {
  const metrics = {
    dailyActive: userActivity.daysActive / 30,          // % days active in month
    sessionLength: Math.min(1, userActivity.avgSessionMinutes / 60), // Capped at 1 hour
    challengesPerSession: Math.min(1, userActivity.avgChallengesPerSession / 3),
    completionRate: userActivity.completionRate,
    socialInteractions: Math.min(1, userActivity.socialActions / 10),
    streakConsistency: userActivity.streakDays / 30
  };
  
  const weights = {
    dailyActive: 0.25,
    sessionLength: 0.15,
    challengesPerSession: 0.20,
    completionRate: 0.20,
    socialInteractions: 0.10,
    streakConsistency: 0.10
  };
  
  let score = 0;
  for (const [metric, value] of Object.entries(metrics)) {
    score += value * weights[metric];
  }
  
  return {
    score: Math.round(score * 100),
    metrics,
    category: getEngagementCategory(score)
  };
}

function getEngagementCategory(score) {
  if (score >= 0.8) return 'highly_engaged';
  if (score >= 0.6) return 'engaged';
  if (score >= 0.4) return 'moderately_engaged';
  if (score >= 0.2) return 'low_engagement';
  return 'at_risk';
}
```

## Reward Scheduling

### Spaced Reward System
```javascript
function calculateNextReward(rewardsReceived, lastRewardDate) {
  // Fibonacci-based spacing for rewards to maintain engagement
  const fibonacci = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55];
  const rewardIndex = Math.min(rewardsReceived, fibonacci.length - 1);
  const daysUntilNext = fibonacci[rewardIndex];
  
  const nextRewardDate = new Date(lastRewardDate);
  nextRewardDate.setDate(nextRewardDate.getDate() + daysUntilNext);
  
  // Reward type escalation
  const rewardTypes = [
    { type: 'xp_boost', value: 1.5, duration: 3600 },        // 1 hour
    { type: 'hint_unlock', value: 3, duration: 86400 },      // 1 day
    { type: 'skip_prereq', value: 1, duration: 604800 },     // 1 week
    { type: 'double_xp', value: 2, duration: 3600 },         // 1 hour
    { type: 'challenge_unlock', value: 1, duration: null }    // Permanent
  ];
  
  const rewardType = rewardTypes[Math.min(rewardIndex % 5, rewardTypes.length - 1)];
  
  return {
    nextDate: nextRewardDate,
    daysUntil: daysUntilNext,
    nextReward: rewardType
  };
}
```

This comprehensive gamification system provides engaging mechanics that encourage consistent learning while maintaining balance and preventing exploitation.