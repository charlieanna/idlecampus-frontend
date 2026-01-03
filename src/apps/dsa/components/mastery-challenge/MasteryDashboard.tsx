import React, { useMemo } from 'react';
import { AdaptiveQueuePanel } from './AdaptiveQueuePanel';
import { MasteryStatsPanel } from './MasteryStatsPanel';
import { useFamilyMasteryStore } from '../../stores/familyMasteryStore';
import { getAllFamilies } from '../../data/problemFamilyMapping';
import { Trophy, TrendingUp, RefreshCw, Activity } from 'lucide-react';
import { Card, CardContent } from "../ui/card";

// Decay calculation constants (same as AdaptiveStreamView)
const DECAY_THRESHOLD = 0.4;
const DECAY_RATE_PER_PROBLEM = 0.05;
const STRUGGLE_DECAY_MULTIPLIER = 1.4;

interface MasteryDashboardProps {
  onStartPractice?: (familyId: string) => void;
}

export const MasteryDashboard: React.FC<MasteryDashboardProps> = ({ onStartPractice }) => {
  const { totalMastered, totalAttempts, familyRecords, initializeStore } = useFamilyMasteryStore();

  React.useEffect(() => {
    initializeStore();
  }, [initializeStore]);

  // Get actual family count from data
  const allFamilies = getAllFamilies();
  const totalFamilies = allFamilies.length;

  // Calculate real stats from familyRecords
  const stats = useMemo(() => {
    const records = Object.values(familyRecords);
    const masteredRecords = records.filter(r => r.isMastered);

    // Calculate problems due for review (decayed)
    let currentIndex = 0;
    // Estimate current index from total mastered
    masteredRecords.forEach(r => {
      if (r.masteredAtIndex && r.masteredAtIndex > currentIndex) {
        currentIndex = r.masteredAtIndex;
      }
    });

    const decayedCount = masteredRecords.filter(r => {
      if (!r.masteredAtIndex) return false;
      const referenceIndex = r.lastReviewedAtIndex ?? r.masteredAtIndex;
      const problemsSince = currentIndex - referenceIndex;
      let decay = problemsSince * DECAY_RATE_PER_PROBLEM;
      if (r.usedHelpOnMastery) decay *= STRUGGLE_DECAY_MULTIPLIER;
      return decay >= DECAY_THRESHOLD;
    }).length;

    // Calculate streak based on recent mastery activity
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    const recentMasteries = masteredRecords
      .filter(r => r.masteredAt && (now - r.masteredAt) < 7 * oneDay)
      .sort((a, b) => (b.masteredAt || 0) - (a.masteredAt || 0));

    let streak = 0;
    if (recentMasteries.length > 0) {
      // Count consecutive days with activity
      const daySet = new Set<string>();
      recentMasteries.forEach(r => {
        if (r.masteredAt) {
          const date = new Date(r.masteredAt).toDateString();
          daySet.add(date);
        }
      });
      streak = daySet.size;
    }

    return {
      masteredCount: masteredRecords.length,
      decayedCount,
      streak,
      currentIndex
    };
  }, [familyRecords]);

  const masteryPercentage = totalFamilies > 0
    ? Math.round((stats.masteredCount / totalFamilies) * 100)
    : 0;

  return (
    <div className="h-full w-full bg-background p-4 flex flex-col gap-4 overflow-hidden">

      {/* HEADER STATS ROW */}
      <div className="flex gap-4 flex-wrap">
        <StatsCard
          icon={<Trophy className="w-5 h-5 text-yellow-500" />}
          label="Mastery Progress"
          value={`${masteryPercentage}%`}
          subValue={`${stats.masteredCount}/${totalFamilies} Concepts`}
        />
        <StatsCard
          icon={<Activity className="w-5 h-5 text-blue-500" />}
          label="Total Attempts"
          value={totalAttempts.toString()}
          subValue="Keep practicing!"
        />
        <StatsCard
          icon={<RefreshCw className="w-5 h-5 text-purple-500" />}
          label="Due for Review"
          value={stats.decayedCount.toString()}
          subValue={stats.decayedCount > 0 ? "Retention fading" : "All fresh!"}
          highlight={stats.decayedCount > 0}
        />
        <StatsCard
          icon={<TrendingUp className="w-5 h-5 text-green-500" />}
          label="Activity Streak"
          value={stats.streak > 0 ? `${stats.streak} Days` : "Start today!"}
          subValue={stats.streak >= 7 ? "🔥 On fire!" : stats.streak > 0 ? "Keep going!" : "Practice to build streak"}
        />
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 flex-1 min-h-0">

        {/* LEFT COLUMN: ADAPTIVE QUEUE (Wide) */}
        <div className="md:col-span-8 h-full min-h-0">
          <AdaptiveQueuePanel onStartPractice={onStartPractice} />
        </div>

        {/* RIGHT COLUMN: DETAILED STATS (Narrow) */}
        <div className="md:col-span-4 h-full min-h-0 flex flex-col gap-4">
          <MasteryStatsPanel />
        </div>

      </div>
    </div>
  );
};

interface StatsCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  subValue: string;
  highlight?: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({ icon, label, value, subValue, highlight }) => (
  <Card className={`flex-1 min-w-[200px] bg-card/50 backdrop-blur-sm border-muted ${
    highlight ? 'border-purple-500/50 bg-purple-500/5' : ''
  }`}>
    <CardContent className="p-4 flex items-center gap-4">
      <div className={`p-3 rounded-full border shadow-sm ${
        highlight ? 'bg-purple-500/10 border-purple-500/30' : 'bg-background'
      }`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">{label}</p>
        <div className="flex items-baseline gap-2">
          <h3 className={`text-2xl font-bold ${highlight ? 'text-purple-600' : ''}`}>{value}</h3>
          <span className="text-xs text-muted-foreground">{subValue}</span>
        </div>
      </div>
    </CardContent>
  </Card>
);
