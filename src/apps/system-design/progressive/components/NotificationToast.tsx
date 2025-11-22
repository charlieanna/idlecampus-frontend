import { useEffect, useState } from 'react';

/**
 * Notification Toast Component
 * Shows achievement unlocked, level up, streak, and XP notifications
 * Based on PROGRESSIVE_FLOW_WIREFRAMES.md
 */

export interface ToastNotification {
  id: string;
  type: 'achievement' | 'level_up' | 'streak' | 'xp';
  title: string;
  message: string;
  icon?: string;
  duration?: number; // milliseconds, default 5000
}

interface NotificationToastProps {
  notifications: ToastNotification[];
  onDismiss: (id: string) => void;
}

function SingleToast({ 
  notification, 
  onDismiss 
}: { 
  notification: ToastNotification; 
  onDismiss: (id: string) => void;
}) {
  const [isExiting, setIsExiting] = useState(false);
  const duration = notification.duration || 5000;

  useEffect(() => {
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, duration - 300); // Start exit animation 300ms before dismissal

    const dismissTimer = setTimeout(() => {
      onDismiss(notification.id);
    }, duration);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(dismissTimer);
    };
  }, [notification.id, duration, onDismiss]);

  const getToastStyle = () => {
    switch (notification.type) {
      case 'achievement':
        return 'bg-gradient-to-r from-purple-600 to-blue-600 text-white';
      case 'level_up':
        return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white';
      case 'streak':
        return 'bg-gradient-to-r from-orange-500 to-red-500 text-white';
      case 'xp':
        return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white';
      default:
        return 'bg-gray-900 text-white';
    }
  };

  const getIcon = () => {
    if (notification.icon) return notification.icon;
    
    switch (notification.type) {
      case 'achievement':
        return '🏆';
      case 'level_up':
        return '⬆️';
      case 'streak':
        return '🔥';
      case 'xp':
        return '✨';
      default:
        return '📢';
    }
  };

  return (
    <div
      className={`
        ${getToastStyle()}
        rounded-lg shadow-lg p-4 min-w-[320px] max-w-md
        transform transition-all duration-300 ease-out
        ${isExiting ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}
        animate-slide-in
      `}
    >
      <div className="flex items-start gap-3">
        <div className="text-3xl flex-shrink-0">
          {getIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="font-bold text-lg mb-1">
            {notification.title}
          </div>
          <div className="text-sm opacity-90">
            {notification.message}
          </div>
        </div>

        <button
          onClick={() => {
            setIsExiting(true);
            setTimeout(() => onDismiss(notification.id), 300);
          }}
          className="flex-shrink-0 text-white/70 hover:text-white transition-colors"
          aria-label="Dismiss notification"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {/* Progress bar */}
      <div className="mt-3 h-1 bg-white/30 rounded-full overflow-hidden">
        <div
          className="h-full bg-white rounded-full animate-progress"
          style={{
            animation: `progress ${duration}ms linear forwards`
          }}
        />
      </div>
    </div>
  );
}

export function NotificationToast({ notifications, onDismiss }: NotificationToastProps) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3">
      {notifications.map((notification) => (
        <SingleToast
          key={notification.id}
          notification={notification}
          onDismiss={onDismiss}
        />
      ))}
    </div>
  );
}

/**
 * Hook to manage toast notifications
 */
export function useNotifications() {
  const [notifications, setNotifications] = useState<ToastNotification[]>([]);

  const showNotification = (notification: Omit<ToastNotification, 'id'>) => {
    const id = `notification-${Date.now()}-${Math.random()}`;
    setNotifications((prev) => [...prev, { ...notification, id }]);
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const showAchievement = (name: string, rarity: string, xpReward: number) => {
    showNotification({
      type: 'achievement',
      title: 'Achievement Unlocked!',
      message: `${name} (${rarity}) - +${xpReward} XP`,
      icon: '🏆',
    });
  };

  const showLevelUp = (newLevel: number, xpForNextLevel: number) => {
    showNotification({
      type: 'level_up',
      title: `Level ${newLevel}!`,
      message: `You leveled up! Next level at ${xpForNextLevel} XP`,
      icon: '⬆️',
    });
  };

  const showStreak = (streakDays: number) => {
    showNotification({
      type: 'streak',
      title: `${streakDays} Day Streak!`,
      message: `Keep going! You're on fire!`,
      icon: '🔥',
    });
  };

  const showXP = (amount: number, source: string) => {
    showNotification({
      type: 'xp',
      title: `+${amount} XP`,
      message: source,
      icon: '✨',
      duration: 3000, // Shorter duration for XP notifications
    });
  };

  return {
    notifications,
    showNotification,
    dismissNotification,
    showAchievement,
    showLevelUp,
    showStreak,
    showXP,
  };
}

// Add CSS animations to global styles or create a separate CSS file
export const toastStyles = `
  @keyframes slide-in {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes progress {
    from {
      width: 100%;
    }
    to {
      width: 0%;
    }
  }

  .animate-slide-in {
    animation: slide-in 0.3s ease-out;
  }

  .animate-progress {
    animation: progress linear forwards;
  }
`;