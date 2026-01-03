import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { Target, Zap, TrendingDown } from 'lucide-react';
import { useFamilyMasteryStore } from '../../stores/familyMasteryStore';
import { getAllFamilies } from '../../data/problemFamilyMapping';

// Module name mapping for radar chart
const MODULE_NAMES: Record<number, string> = {
  1: 'Arrays',
  2: 'Two Pointers',
  3: 'Sliding Window',
  4: 'Stack',
  5: 'Binary Search',
  6: 'Linked List',
  7: 'Trees',
  8: 'Tries',
  9: 'Heap/PQ',
  10: 'Backtracking',
  11: 'Graphs',
  12: 'Adv Graphs',
  13: '1D DP',
  14: '2D DP',
  15: 'Greedy',
  16: 'Intervals',
  17: 'Math & Geo',
  18: 'Bit Manip',
};

interface MasteryStatsPanelProps {
  onTargetWeakness?: (familyId: string) => void;
}

export const MasteryStatsPanel: React.FC<MasteryStatsPanelProps> = ({ onTargetWeakness }) => {
  const { familyRecords } = useFamilyMasteryStore();
  const allFamilies = getAllFamilies();

  // Calculate real radar data and weaknesses
  const { radarData, weaknesses } = useMemo(() => {
    // Group families by module
    const moduleStats: Record<number, { total: number; mastered: number; struggled: number }> = {};

    allFamilies.forEach(family => {
      const moduleId = family.moduleId;
      if (!moduleStats[moduleId]) {
        moduleStats[moduleId] = { total: 0, mastered: 0, struggled: 0 };
      }
      moduleStats[moduleId].total++;

      const record = familyRecords[family.familyId];
      if (record?.isMastered) {
        moduleStats[moduleId].mastered++;
        if (record.usedHelpOnMastery || (record.totalAttempts && record.totalAttempts > 3)) {
          moduleStats[moduleId].struggled++;
        }
      }
    });

    // Generate radar data (top 6 modules by activity)
    const radarData = Object.entries(moduleStats)
      .filter(([id]) => MODULE_NAMES[parseInt(id)])
      .slice(0, 6)
      .map(([id, stats]) => ({
        subject: MODULE_NAMES[parseInt(id)] || `M${id}`,
        A: stats.total > 0 ? Math.round((stats.mastered / stats.total) * 100) : 0,
        fullMark: 100,
      }));

    // Find weaknesses (modules with low mastery or high struggle rate)
    const weaknesses = Object.entries(moduleStats)
      .map(([id, stats]) => {
        const masteryPercent = stats.total > 0 ? Math.round((stats.mastered / stats.total) * 100) : 0;
        const struggleRate = stats.mastered > 0 ? stats.struggled / stats.mastered : 0;
        return {
          moduleId: parseInt(id),
          name: MODULE_NAMES[parseInt(id)] || `Module ${id}`,
          masteryPercent,
          struggleRate,
          // Lower score = weaker
          weaknessScore: masteryPercent - (struggleRate * 30),
        };
      })
      .filter(m => m.masteryPercent < 80 || m.struggleRate > 0.3)
      .sort((a, b) => a.weaknessScore - b.weaknessScore)
      .slice(0, 3);

    return { radarData, weaknesses };
  }, [familyRecords, allFamilies]);
  return (
    <div className="flex flex-col gap-4 h-full">

      {/* SKILL RADAR */}
      <Card className="flex-1 border-l-4 border-l-purple-500/20">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-md">
            <Target className="w-4 h-4 text-purple-500" />
            Skill Radar
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[200px] w-full">
          {radarData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid strokeOpacity={0.2} />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#888', fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name="Mastery %"
                  dataKey="A"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  fill="#8b5cf6"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
              Complete problems to see your skill radar
            </div>
          )}
        </CardContent>
      </Card>

      {/* WEAKNESS FOCUS */}
      <Card className="flex-1 border-l-4 border-l-red-500/20">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-md">
            <TrendingDown className="w-4 h-4 text-red-500" />
            Weakness Focus
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {weaknesses.length > 0 ? (
            <>
              {weaknesses.map((weakness, i) => (
                <WeaknessItem
                  key={weakness.moduleId}
                  label={weakness.name}
                  percent={weakness.masteryPercent}
                  color={i === 0 ? "bg-red-500" : i === 1 ? "bg-orange-500" : "bg-yellow-500"}
                  description={
                    weakness.struggleRate > 0.5
                      ? "High struggle rate detected"
                      : weakness.masteryPercent < 30
                        ? "Needs more practice"
                        : "Room for improvement"
                  }
                />
              ))}
              {onTargetWeakness && weaknesses[0] && (
                <div className="pt-2">
                  <button
                    onClick={() => {
                      // Find first family in weakest module
                      const weakFamily = allFamilies.find(f => f.moduleId === weaknesses[0].moduleId);
                      if (weakFamily) onTargetWeakness(weakFamily.familyId);
                    }}
                    className="w-full py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <Zap className="w-4 h-4" />
                    Target Weaknesses
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center text-muted-foreground text-sm py-4">
              <p className="mb-2">🎉 No weak areas detected!</p>
              <p className="text-xs">Keep practicing to maintain mastery</p>
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  );
};

const WeaknessItem = ({ label, percent, color, description }: { label: string, percent: number, color: string, description: string }) => (
  <div className="space-y-1">
    <div className="flex justify-between items-center text-sm">
      <span className="font-medium">{label}</span>
      <span className="text-xs text-muted-foreground">{percent}% Mastery</span>
    </div>
    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
      <div className={`h-full ${color} rounded-full`} style={{ width: `${percent}%` }} />
    </div>
    <p className="text-[10px] text-muted-foreground">{description}</p>
  </div>
);
