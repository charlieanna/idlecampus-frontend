import { useState, useEffect } from 'react';
import { Search, Copy, Check, ChevronDown, ChevronRight, Filter, BookOpen, Command as CommandIcon } from 'lucide-react';

// ============================================
// TYPES
// ============================================

interface DockerCommand {
  id: number;
  command: string;
  explanation: string;
  difficulty: 'easy' | 'intermediate' | 'advanced';
  category: string;
  flags?: Record<string, string>;
  variations?: string[];
  use_cases?: string;
  gotchas?: string;
  exam_frequency?: number;
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

// ============================================
// COMMAND CARD COMPONENT
// ============================================

interface CommandCardProps {
  command: DockerCommand;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

function CommandCard({ command, isExpanded, onToggleExpand }: CommandCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(command.command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const difficultyColors = {
    easy: 'bg-green-100 text-green-800 border-green-200',
    intermediate: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    advanced: 'bg-red-100 text-red-800 border-red-200'
  };

  const categoryColors: Record<string, string> = {
    basics: 'bg-blue-100 text-blue-800',
    images: 'bg-purple-100 text-purple-800',
    networks: 'bg-teal-100 text-teal-800',
    volumes: 'bg-orange-100 text-orange-800',
    registry: 'bg-indigo-100 text-indigo-800',
    security: 'bg-red-100 text-red-800'
  };

  return (
    <div className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <CommandIcon className="w-4 h-4 text-slate-500" />
            <code className="text-sm font-mono font-semibold text-slate-900 bg-slate-100 px-2 py-1 rounded">
              {command.command}
            </code>
            <button
              onClick={handleCopy}
              className="p-1 hover:bg-slate-100 rounded transition-colors"
              title="Copy command"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <Copy className="w-4 h-4 text-slate-500" />
              )}
            </button>
          </div>
          <p className="text-sm text-slate-600">{command.explanation}</p>
        </div>
      </div>

      {/* Tags */}
      <div className="flex items-center gap-2 mb-3">
        <span className={cn(
          'text-xs px-2 py-1 rounded-full border font-medium',
          difficultyColors[command.difficulty]
        )}>
          {command.difficulty}
        </span>
        <span className={cn(
          'text-xs px-2 py-1 rounded-full font-medium',
          categoryColors[command.category] || 'bg-slate-100 text-slate-800'
        )}>
          {command.category}
        </span>
        {command.exam_frequency && command.exam_frequency >= 8 && (
          <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-800 font-medium">
            High Frequency
          </span>
        )}
      </div>

      {/* Expandable Details */}
      {(command.flags || command.variations || command.use_cases || command.gotchas) && (
        <>
          <button
            onClick={onToggleExpand}
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium mt-2"
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
            {isExpanded ? 'Hide' : 'Show'} details
          </button>

          {isExpanded && (
            <div className="mt-3 space-y-3 border-t pt-3">
              {/* Flags */}
              {command.flags && Object.keys(command.flags).length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-slate-700 uppercase mb-2">Flags</h4>
                  <div className="space-y-1">
                    {Object.entries(command.flags).map(([flag, desc]) => (
                      <div key={flag} className="flex gap-2 text-sm">
                        <code className="font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded flex-shrink-0">
                          {flag}
                        </code>
                        <span className="text-slate-600">{desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Variations */}
              {command.variations && command.variations.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-slate-700 uppercase mb-2">Variations</h4>
                  <div className="space-y-1">
                    {command.variations.map((variation, index) => (
                      <code key={index} className="block font-mono text-sm text-slate-700 bg-slate-50 px-2 py-1 rounded">
                        {variation}
                      </code>
                    ))}
                  </div>
                </div>
              )}

              {/* Use Cases */}
              {command.use_cases && (
                <div>
                  <h4 className="text-xs font-semibold text-slate-700 uppercase mb-2">Use Cases</h4>
                  <p className="text-sm text-slate-600">{command.use_cases}</p>
                </div>
              )}

              {/* Gotchas */}
              {command.gotchas && (
                <div>
                  <h4 className="text-xs font-semibold text-amber-700 uppercase mb-2 flex items-center gap-1">
                    ⚠️ Gotchas
                  </h4>
                  <p className="text-sm text-amber-800 bg-amber-50 p-2 rounded">{command.gotchas}</p>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

// Module mapping - maps command categories to course modules
const MODULE_MAPPING: Record<string, { title: string; categories: string[] }> = {
  'container-basics': { title: 'Container Basics', categories: ['basics', 'containers'] },
  'images-dockerfiles': { title: 'Images and Dockerfiles', categories: ['images'] },
  'networking-ports': { title: 'Networking & Ports', categories: ['networks'] },
  'volumes-storage': { title: 'Volumes & Storage', categories: ['volumes'] },
  'docker-compose': { title: 'Docker Compose', categories: ['compose', 'swarm'] },
  'security': { title: 'Security & Best Practices', categories: ['security'] },
  'registries': { title: 'Registries & CI/CD', categories: ['registry'] },
};

export default function CommandsReferenceViewer() {
  const [commands, setCommands] = useState<DockerCommand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModule, setSelectedModule] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [expandedCommands, setExpandedCommands] = useState<Set<number>>(new Set());

  // Fetch commands from API
  useEffect(() => {
    const fetchCommands = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3000/api/v1/docker/commands');

        if (!response.ok) {
          throw new Error(`Failed to fetch commands: ${response.status}`);
        }

        const data = await response.json();
        setCommands(data.commands || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching commands:', err);
        setError(err instanceof Error ? err.message : 'Failed to load commands');
      } finally {
        setLoading(false);
      }
    };

    fetchCommands();
  }, []);

  const difficulties = ['all', 'easy', 'intermediate', 'advanced'];

  // Filter commands
  const filteredCommands = commands.filter(cmd => {
    const matchesSearch = searchQuery === '' ||
      cmd.command.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cmd.explanation.toLowerCase().includes(searchQuery.toLowerCase());

    // Match module based on category mapping
    let matchesModule = selectedModule === 'all';
    if (!matchesModule && selectedModule !== 'all') {
      const moduleConfig = MODULE_MAPPING[selectedModule];
      matchesModule = moduleConfig ? moduleConfig.categories.includes(cmd.category) : false;
    }

    const matchesDifficulty = selectedDifficulty === 'all' || cmd.difficulty === selectedDifficulty;

    return matchesSearch && matchesModule && matchesDifficulty;
  });

  // Group commands by module
  const groupedCommands: Record<string, DockerCommand[]> = {};

  Object.entries(MODULE_MAPPING).forEach(([moduleKey, moduleConfig]) => {
    const moduleCommands = filteredCommands.filter(cmd =>
      moduleConfig.categories.includes(cmd.category)
    );
    if (moduleCommands.length > 0) {
      groupedCommands[moduleKey] = moduleCommands;
    }
  });

  const toggleExpand = (commandId: number) => {
    setExpandedCommands(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commandId)) {
        newSet.delete(commandId);
      } else {
        newSet.add(commandId);
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading Docker commands...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-50">
        <div className="text-center max-w-md">
          <div className="text-red-600 mb-4">
            <BookOpen className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Failed to Load Commands</h3>
          <p className="text-slate-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Docker Commands Reference</h1>
            <p className="text-sm text-slate-600 mt-1">
              {filteredCommands.length} of {commands.length} commands
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-slate-400" />
            <span className="text-sm text-slate-600">Filter by:</span>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search commands..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Module Filter */}
          <select
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="all">All Modules</option>
            {Object.entries(MODULE_MAPPING).map(([key, config]) => (
              <option key={key} value={key}>
                {config.title}
              </option>
            ))}
          </select>

          {/* Difficulty Filter */}
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            {difficulties.map(diff => (
              <option key={diff} value={diff}>
                {diff === 'all' ? 'All Levels' : diff.charAt(0).toUpperCase() + diff.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Commands by Module/Chapter */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {filteredCommands.length === 0 ? (
          <div className="text-center py-12">
            <CommandIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No commands found matching your filters.</p>
          </div>
        ) : (
          <div className="space-y-8 pb-4">
            {Object.entries(groupedCommands).map(([moduleKey, moduleCommands]) => {
              const moduleConfig = MODULE_MAPPING[moduleKey];

              return (
                <div key={moduleKey} className="space-y-4">
                  {/* Chapter/Module Header */}
                  <div className="flex items-center gap-3 pb-3 border-b-2 border-blue-200">
                    <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">{moduleConfig.title}</h2>
                      <p className="text-sm text-slate-600">{moduleCommands.length} commands</p>
                    </div>
                  </div>

                  {/* Commands Grid for this Module */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {moduleCommands.map(cmd => (
                      <CommandCard
                        key={cmd.id}
                        command={cmd}
                        isExpanded={expandedCommands.has(cmd.id)}
                        onToggleExpand={() => toggleExpand(cmd.id)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
