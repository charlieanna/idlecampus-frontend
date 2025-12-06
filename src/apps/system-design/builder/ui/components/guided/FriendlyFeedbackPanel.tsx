import { StepValidationResult, GuidedStep } from '../../../types/guidedTutorial';
import { Lightbulb, AlertCircle, ArrowRight, HelpCircle, Sparkles, RefreshCw } from 'lucide-react';

interface FriendlyFeedbackPanelProps {
  result: StepValidationResult | null;
  isValidating: boolean;
  step: GuidedStep;
  attemptCount?: number;
  onDismiss?: () => void;
  onShowHint?: () => void;
}

const CONTEXTUAL_MESSAGES: Record<string, {
  friendly: string;
  whyItMatters: string;
  realWorldExample?: string;
  encouragement: string;
}> = {
  'missing-client': {
    friendly: "Looks like we're missing a Client component!",
    whyItMatters: "Without a Client, there's no one to send requests to your system. Think of it as the user's browser or mobile app.",
    realWorldExample: "Every web app starts with a user clicking something in their browser.",
    encouragement: "Drag the Client from the sidebar to get started!",
  },
  'missing-app_server': {
    friendly: "Your system needs an App Server to process requests!",
    whyItMatters: "The App Server is the brain of your system - it receives requests, runs your code, and sends back responses.",
    realWorldExample: "When you click a TinyURL link, an app server somewhere is looking up the original URL for you.",
    encouragement: "Add an App Server and connect it to your Client.",
  },
  'missing-compute': {
    friendly: "Your system needs an App Server to process requests!",
    whyItMatters: "The App Server is the brain of your system - it receives requests, runs your code, and sends back responses.",
    encouragement: "Add an App Server and connect it to your Client.",
  },
  'missing-database': {
    friendly: "Your data needs a permanent home!",
    whyItMatters: "Right now, if your server restarts, all your shortened URLs would vanish into thin air. That's because they're only stored in memory (RAM), which gets wiped on restart.",
    realWorldExample: "In 2019, MySpace lost 12 years of user-uploaded music because of a data migration gone wrong. Proper persistent storage is critical!",
    encouragement: "Add a Database to store your URL mappings safely.",
  },
  'missing-storage': {
    friendly: "Your data needs a permanent home!",
    whyItMatters: "Without persistent storage, your data lives only in memory. When the server restarts - poof! Everything's gone.",
    realWorldExample: "Imagine if every shortened URL stopped working when TinyURL updated their servers!",
    encouragement: "Add a Database to keep your data safe.",
  },
  'missing-cache': {
    friendly: "Time to speed things up with a cache!",
    whyItMatters: "Your database is doing all the heavy lifting right now. With 11,000+ reads per second, every request hitting the database means slow responses and potential overload.",
    realWorldExample: "Reddit uses caching extensively - popular posts are served from cache, reducing database load by 90%+.",
    encouragement: "Add a Cache (like Redis) between your App Server and Database.",
  },
  'missing-redis': {
    friendly: "Time to speed things up with a cache!",
    whyItMatters: "Popular URLs get clicked thousands of times. Fetching from database each time is slow and expensive. A cache remembers recent lookups.",
    encouragement: "Add Redis to cache those hot URLs!",
  },
  'missing-load_balancer': {
    friendly: "Your single server is getting overwhelmed!",
    whyItMatters: "One app server can only handle so many requests. At 35K requests/second during peak, a single server would crash and burn.",
    realWorldExample: "Netflix uses sophisticated load balancing to distribute millions of concurrent streams across thousands of servers.",
    encouragement: "Add a Load Balancer to distribute traffic across multiple servers.",
  },
  'missing-connection-client-app_server': {
    friendly: "Your Client and App Server aren't talking to each other!",
    whyItMatters: "Components on the canvas need to be connected for data to flow between them. It's like having phones without calling each other.",
    encouragement: "Drag from Client to App Server to create a connection.",
  },
  'missing-connection-app_server-database': {
    friendly: "Your App Server can't reach the Database!",
    whyItMatters: "The App Server needs to read and write URL mappings to the Database. Without a connection, it's trying to send mail without an address.",
    encouragement: "Connect your App Server to the Database.",
  },
  'missing-connection-app_server-cache': {
    friendly: "Your App Server isn't using the Cache!",
    whyItMatters: "You added a Cache, but it's not connected. It's like having a shortcut but still taking the long way.",
    encouragement: "Connect App Server → Cache to start caching lookups.",
  },
  'api-not-configured': {
    friendly: "Your App Server doesn't know what APIs to handle!",
    whyItMatters: "An App Server without API endpoints is like a chef without a menu - they don't know what to cook!",
    realWorldExample: "REST APIs define the contract: POST to create, GET to read. TinyURL needs both.",
    encouragement: "Click on the App Server and assign the API endpoints.",
  },
  'replication-not-configured': {
    friendly: "Your Database is a single point of failure!",
    whyItMatters: "If your only database server crashes, your entire service goes down. Replication creates backup copies that can take over instantly.",
    realWorldExample: "In 2017, GitLab accidentally deleted their primary database. Their replicas saved them from complete data loss!",
    encouragement: "Enable replication with at least 2 replicas for high availability.",
  },
  'instances-not-configured': {
    friendly: "Running on a single instance is risky!",
    whyItMatters: "If your one App Server goes down for any reason - crash, update, hardware failure - your entire service stops. Multiple instances provide redundancy.",
    realWorldExample: "AWS runs everything with multiple instances across multiple availability zones. 'Everything fails, all the time' - Werner Vogels",
    encouragement: "Increase App Server instances to 2 or more.",
  },
  'cache-strategy-not-configured': {
    friendly: "Your Cache needs some ground rules!",
    whyItMatters: "Without a TTL (Time-To-Live), cached data might get stale. Without a strategy, you won't know when to cache or invalidate.",
    realWorldExample: "Facebook's memcached serves billions of requests. They use careful TTLs to balance freshness vs performance.",
    encouragement: "Set a TTL (e.g., 3600 seconds) and pick a caching strategy.",
  },
  'capacity-not-configured': {
    friendly: "Your Database needs more write capacity!",
    whyItMatters: "With 345 writes/second at peak, your database needs to be provisioned properly or it'll become a bottleneck.",
    encouragement: "Configure write capacity to at least 100 RPS.",
  },
  'over-budget': {
    friendly: "Whoa, we're over budget!",
    whyItMatters: "Real systems have cost constraints. The best architecture balances performance, reliability, AND cost.",
    realWorldExample: "Startups often over-provision initially. The art is finding the right balance.",
    encouragement: "Try reducing instances, replicas, or memory sizes to stay under budget.",
  },
};

function getFriendlyContext(
  result: StepValidationResult,
  _step: GuidedStep
): { friendly: string; whyItMatters: string; realWorldExample?: string; encouragement: string } | null {
  if (result.missingComponents && result.missingComponents.length > 0) {
    const missingType = result.missingComponents[0];
    const key = `missing-${missingType}`;
    if (CONTEXTUAL_MESSAGES[key]) {
      return CONTEXTUAL_MESSAGES[key];
    }
  }

  if (result.missingConnections && result.missingConnections.length > 0) {
    const conn = result.missingConnections[0];
    const key = `missing-connection-${conn.from}-${conn.to}`;
    if (CONTEXTUAL_MESSAGES[key]) {
      return CONTEXTUAL_MESSAGES[key];
    }
  }

  if (result.feedback?.toLowerCase().includes('api')) {
    return CONTEXTUAL_MESSAGES['api-not-configured'];
  }

  if (result.feedback?.toLowerCase().includes('replication')) {
    return CONTEXTUAL_MESSAGES['replication-not-configured'];
  }

  if (result.feedback?.toLowerCase().includes('instances') || result.feedback?.toLowerCase().includes('multiple')) {
    return CONTEXTUAL_MESSAGES['instances-not-configured'];
  }

  if (result.feedback?.toLowerCase().includes('ttl') || result.feedback?.toLowerCase().includes('strategy')) {
    return CONTEXTUAL_MESSAGES['cache-strategy-not-configured'];
  }

  if (result.feedback?.toLowerCase().includes('capacity')) {
    return CONTEXTUAL_MESSAGES['capacity-not-configured'];
  }

  if (result.feedback?.toLowerCase().includes('budget') || result.feedback?.toLowerCase().includes('cost')) {
    return CONTEXTUAL_MESSAGES['over-budget'];
  }

  return null;
}

function getEncouragementByAttempt(attemptCount: number): string {
  if (attemptCount === 1) {
    return "No worries, let's figure this out together!";
  } else if (attemptCount === 2) {
    return "You're getting closer! Try checking the hints below.";
  } else if (attemptCount === 3) {
    return "Persistence is key in system design! Take another look.";
  } else if (attemptCount >= 4) {
    return "Don't give up! Even senior engineers iterate multiple times.";
  }
  return "Let's work through this step by step.";
}

export function FriendlyFeedbackPanel({
  result,
  isValidating,
  step,
  attemptCount = 0,
  onDismiss,
  onShowHint,
}: FriendlyFeedbackPanelProps) {
  if (isValidating) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
            </div>
          </div>
          <div>
            <p className="text-blue-800 font-medium">Checking your design...</p>
            <p className="text-sm text-blue-600 mt-0.5">Looking at components and connections</p>
          </div>
        </div>
      </div>
    );
  }

  if (!result) return null;

  if (result.passed) {
    return (
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="text-lg font-bold text-green-800 mb-1">
              Excellent work!
            </h4>
            <p className="text-green-700">{result.feedback}</p>
            <div className="mt-3 flex items-center gap-2 text-green-600">
              <ArrowRight className="w-4 h-4" />
              <span className="text-sm font-medium">Ready for the next step!</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const context = getFriendlyContext(result, step);
  const encouragement = getEncouragementByAttempt(attemptCount);

  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl overflow-hidden shadow-sm">
      <div className="p-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
            <HelpCircle className="w-6 h-6 text-amber-600" />
          </div>
          <div className="flex-1">
            <h4 className="text-lg font-bold text-amber-800 mb-1">
              Almost there!
            </h4>
            <p className="text-amber-700 text-sm mb-2">{encouragement}</p>
            
            {context ? (
              <div className="space-y-3 mt-4">
                <div className="bg-white/60 rounded-lg p-4 border border-amber-100">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-800">{context.friendly}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50/80 rounded-lg p-4 border border-blue-100">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-blue-800 mb-1">Why this matters:</p>
                      <p className="text-sm text-blue-700">{context.whyItMatters}</p>
                    </div>
                  </div>
                </div>

                {context.realWorldExample && (
                  <div className="bg-purple-50/80 rounded-lg p-4 border border-purple-100">
                    <div className="flex items-start gap-3">
                      <span className="text-lg">🌍</span>
                      <div>
                        <p className="text-sm font-medium text-purple-800 mb-1">Real-world example:</p>
                        <p className="text-sm text-purple-700">{context.realWorldExample}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 text-amber-700 bg-amber-100/50 rounded-lg px-4 py-3">
                  <ArrowRight className="w-4 h-4" />
                  <span className="text-sm font-medium">{context.encouragement}</span>
                </div>
              </div>
            ) : (
              <div className="space-y-3 mt-4">
                <div className="bg-white/60 rounded-lg p-4 border border-amber-100">
                  <p className="text-gray-700">{result.feedback}</p>
                </div>

                {result.suggestions && result.suggestions.length > 0 && (
                  <div className="bg-blue-50/80 rounded-lg p-4 border border-blue-100">
                    <p className="text-sm font-medium text-blue-800 mb-2">Try this:</p>
                    <ul className="space-y-1.5">
                      {result.suggestions.map((suggestion, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-blue-700">
                          <span className="text-blue-500 mt-0.5">•</span>
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-amber-100/50 px-5 py-3 border-t border-amber-200 flex items-center justify-between">
        <button
          onClick={onShowHint}
          className="text-sm text-amber-700 hover:text-amber-800 font-medium flex items-center gap-1.5 transition-colors"
        >
          <Lightbulb className="w-4 h-4" />
          Need more help?
        </button>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-sm text-amber-600 hover:text-amber-700 transition-colors"
          >
            Try again
          </button>
        )}
      </div>
    </div>
  );
}
