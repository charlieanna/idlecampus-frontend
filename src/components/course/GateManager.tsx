import { useState, useEffect } from 'react';
import { MasteryGate, GateStatus } from './MasteryGate';
import { DrillSession, DrillSessionData, DrillResult } from './DrillSession';

// ============================================
// TYPES
// ============================================

export interface GateManagerProps {
  lessonId: string;
  lessonTitle: string;
  onGatePassed?: () => void;
  autoCheck?: boolean;
}

type ViewMode = 'checking' | 'gate' | 'drilling' | 'passed';

// ============================================
// GATE MANAGER COMPONENT
// ============================================

export function GateManager({
  lessonId,
  lessonTitle,
  onGatePassed,
  autoCheck = true
}: GateManagerProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('checking');
  const [gateStatus, setGateStatus] = useState<GateStatus | null>(null);
  const [drillSession, setDrillSession] = useState<DrillSessionData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-check gate on mount
  useEffect(() => {
    if (autoCheck) {
      checkGate();
    }
  }, [lessonId, autoCheck]);

  // Check if user can progress past this lesson
  const checkGate = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/mastery/check_gate?lesson_id=${lessonId}`);

      if (!response.ok) {
        throw new Error(`Failed to check gate: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setGateStatus(data.gate_status);

        if (data.can_progress) {
          setViewMode('passed');
          if (onGatePassed) {
            onGatePassed();
          }
        } else {
          setViewMode('gate');
          // Pre-load drill session for faster UX
          if (data.drill_session) {
            setDrillSession(data.drill_session);
          }
        }
      } else {
        setError(data.error || 'Failed to check gate');
      }
    } catch (err) {
      console.error('Error checking gate:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  // Start drill session
  const startDrillSession = async () => {
    // If we already have drills from gate check, use them
    if (drillSession) {
      setViewMode('drilling');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/mastery/generate_drill_session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lesson_id: lessonId,
          session_type: 'remediation'
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to generate drills: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.has_drills) {
        setDrillSession(data.session);
        setViewMode('drilling');
      } else {
        setError('No drills available');
      }
    } catch (err) {
      console.error('Error generating drills:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  // Handle drill session completion
  const handleDrillSessionComplete = async (results: DrillResult[]) => {
    console.log('Drill session completed:', results);

    // Re-check gate to see if user can now progress
    await checkGate();
  };

  // Handle exiting drill session
  const handleExitDrill = () => {
    setViewMode('gate');
    setDrillSession(null);
  };

  // Pass the gate manually (call API to record passage)
  const passGate = async () => {
    try {
      await fetch('/api/mastery/pass_gate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lesson_id: lessonId })
      });

      setViewMode('passed');
      if (onGatePassed) {
        onGatePassed();
      }
    } catch (err) {
      console.error('Error passing gate:', err);
    }
  };

  // Auto-pass gate when status becomes can_progress
  useEffect(() => {
    if (gateStatus?.can_progress && viewMode === 'gate') {
      passGate();
    }
  }, [gateStatus?.can_progress, viewMode]);

  // Loading state
  if (loading && viewMode === 'checking') {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
          <p className="text-slate-600">Checking mastery requirements...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-800">Error: {error}</p>
        <button
          onClick={checkGate}
          className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
        >
          Try again
        </button>
      </div>
    );
  }

  // Passed state - show nothing (gate is open)
  if (viewMode === 'passed') {
    return null;
  }

  // Drilling state
  if (viewMode === 'drilling' && drillSession) {
    return (
      <DrillSession
        session={drillSession}
        onSessionComplete={handleDrillSessionComplete}
        onExit={handleExitDrill}
      />
    );
  }

  // Gate state - show requirements
  if (viewMode === 'gate' && gateStatus) {
    return (
      <MasteryGate
        gateStatus={gateStatus}
        lessonTitle={lessonTitle}
        onStartDrill={startDrillSession}
        onRetryCheck={checkGate}
        showDrillButton={true}
      />
    );
  }

  return null;
}
