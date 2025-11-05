import { useState, useEffect } from 'react';
import { Code2, CheckCircle, Circle, Trophy } from 'lucide-react';
import { CodeEditor } from '../../components/course/CodeEditor';
import { ScrollArea } from '../../components/ui/scroll-area';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Card } from '../../components/ui/card';
import type { CodeLab, CodeLabSummary } from '../../types/codeLab';
import { DIFFICULTY_COLORS } from '../../types/codeLab';
import { apiService } from '../../services/api';

export default function GolangApp() {
  const [labs, setLabs] = useState<CodeLabSummary[]>([]);
  const [selectedLabId, setSelectedLabId] = useState<number | null>(null);
  const [selectedLab, setSelectedLab] = useState<CodeLab | null>(null);
  const [completedLabs, setCompletedLabs] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadLabs();
  }, []);

  useEffect(() => {
    if (selectedLabId) {
      loadLabDetails(selectedLabId);
    }
  }, [selectedLabId]);

  const loadLabs = async () => {
    try {
      setLoading(true);
      const response = await apiService.fetchCodeLabs({ language: 'golang' });
      setLabs(response.labs);
      if (response.labs.length > 0 && !selectedLabId) {
        setSelectedLabId(response.labs[0].id);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadLabDetails = async (labId: number) => {
    try {
      const response = await apiService.fetchCodeLab(labId);
      setSelectedLab(response.lab);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleLabComplete = () => {
    if (selectedLabId) {
      setCompletedLabs(prev => new Set([...prev, selectedLabId]));

      // Auto-advance to next lab
      const currentIndex = labs.findIndex(lab => lab.id === selectedLabId);
      if (currentIndex < labs.length - 1) {
        setSelectedLabId(labs[currentIndex + 1].id);
      }
    }
  };

  const completedCount = completedLabs.size;
  const totalLabs = labs.length;
  const progress = totalLabs > 0 ? (completedCount / totalLabs) * 100 : 0;

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading Go labs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <Card className="p-6 max-w-md">
          <h2 className="text-red-600 text-xl mb-2">Error Loading Labs</h2>
          <p className="text-slate-600">{error}</p>
          <Button onClick={loadLabs} className="mt-4">
            Retry
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-white">
      {/* Left Sidebar - Lab List */}
      <div className="w-80 border-r bg-slate-50 flex flex-col">
        <div className="p-4 border-b bg-cyan-600 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Code2 className="w-6 h-6" />
            <h1 className="text-xl font-bold">Go Course</h1>
          </div>
          <p className="text-cyan-100 text-sm">Master Go Programming</p>

          {totalLabs > 0 && (
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Progress</span>
                <span>{completedCount}/{totalLabs} labs</span>
              </div>
              <div className="w-full bg-cyan-800 rounded-full h-2">
                <div
                  className="bg-white h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-2">
            {labs.map((lab, index) => {
              const isSelected = selectedLabId === lab.id;
              const isCompleted = completedLabs.has(lab.id);

              return (
                <Button
                  key={lab.id}
                  variant={isSelected ? 'secondary' : 'ghost'}
                  className="w-full justify-start text-left h-auto py-3"
                  onClick={() => setSelectedLabId(lab.id)}
                >
                  <div className="flex items-start gap-3 w-full">
                    <div className="mt-0.5">
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-400" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm text-slate-500">{index + 1}.</span>
                        <span className="font-medium truncate">{lab.title}</span>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className={`${DIFFICULTY_COLORS[lab.difficulty]} text-xs`}>
                          {lab.difficulty}
                        </Badge>
                        <span className="text-xs text-slate-500">
                          {lab.estimated_minutes} min
                        </span>
                        <span className="text-xs text-slate-500">
                          {lab.points_reward} pts
                        </span>
                      </div>

                      {isCompleted && (
                        <Badge className="mt-1 bg-green-100 text-green-700 text-xs">
                          Completed
                        </Badge>
                      )}
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>
        </ScrollArea>

        {/* Stats Footer */}
        {completedCount === totalLabs && totalLabs > 0 && (
          <div className="p-4 border-t bg-green-50">
            <div className="flex items-center gap-2 text-green-700">
              <Trophy className="w-5 h-5" />
              <div>
                <div className="font-semibold text-sm">Course Complete!</div>
                <div className="text-xs">You've mastered all Go labs</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right - Code Editor */}
      <div className="flex-1">
        {selectedLab ? (
          <CodeEditor
            lab={selectedLab}
            onComplete={handleLabComplete}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-slate-500">
            Select a lab to get started
          </div>
        )}
      </div>
    </div>
  );
}
