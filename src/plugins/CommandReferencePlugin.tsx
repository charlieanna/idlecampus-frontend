/**
 * Command Reference Plugin
 *
 * Adds searchable command documentation sidebar for:
 * - Docker commands
 * - Kubernetes commands
 * - Linux commands
 *
 * Corresponds to backend: command_reference_plugin.rb
 */

import { useState } from 'react';
import { Search, BookOpen, X, Terminal } from 'lucide-react';

export interface CommandReferencePluginProps {
  courseSlug: string;
  enabled?: boolean;
  command_type?: 'docker' | 'kubernetes' | 'linux';
  searchable?: boolean;
}

interface Command {
  name: string;
  description: string;
  syntax: string;
  example: string;
  category: string;
}

// Sample commands (would be fetched from API in production)
const SAMPLE_COMMANDS: Record<string, Command[]> = {
  docker: [
    {
      name: 'docker run',
      description: 'Run a command in a new container',
      syntax: 'docker run [OPTIONS] IMAGE [COMMAND] [ARG...]',
      example: 'docker run -d -p 80:80 nginx',
      category: 'Containers'
    },
    {
      name: 'docker ps',
      description: 'List containers',
      syntax: 'docker ps [OPTIONS]',
      example: 'docker ps -a',
      category: 'Containers'
    },
    {
      name: 'docker build',
      description: 'Build an image from a Dockerfile',
      syntax: 'docker build [OPTIONS] PATH',
      example: 'docker build -t myapp:latest .',
      category: 'Images'
    }
  ],
  kubernetes: [
    {
      name: 'kubectl get',
      description: 'Display one or many resources',
      syntax: 'kubectl get [RESOURCE] [NAME] [FLAGS]',
      example: 'kubectl get pods',
      category: 'Basic'
    },
    {
      name: 'kubectl apply',
      description: 'Apply a configuration to a resource',
      syntax: 'kubectl apply -f FILENAME',
      example: 'kubectl apply -f deployment.yaml',
      category: 'Basic'
    }
  ],
  linux: [
    {
      name: 'ls',
      description: 'List directory contents',
      syntax: 'ls [OPTIONS] [FILE]',
      example: 'ls -la /home',
      category: 'File System'
    },
    {
      name: 'grep',
      description: 'Search for patterns in files',
      syntax: 'grep [OPTIONS] PATTERN [FILE...]',
      example: 'grep -r "error" /var/log/',
      category: 'Text Processing'
    }
  ]
};

export default function CommandReferencePlugin({
  courseSlug,
  enabled = true,
  command_type = 'docker',
  searchable = true
}: CommandReferencePluginProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCommand, setSelectedCommand] = useState<Command | null>(null);

  if (!enabled) {
    return null;
  }

  const commands = SAMPLE_COMMANDS[command_type] || [];
  const filteredCommands = searchQuery
    ? commands.filter(cmd =>
        cmd.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cmd.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : commands;

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-20 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
        title="Command Reference"
      >
        <BookOpen className="w-5 h-5" />
      </button>

      {/* Sidebar */}
      {isOpen && (
        <div className="fixed top-0 right-0 h-screen w-96 bg-white shadow-2xl z-40 flex flex-col border-l border-slate-200">
          {/* Header */}
          <div className="p-4 border-b border-slate-200 bg-slate-50">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-slate-900 flex items-center">
                <Terminal className="w-5 h-5 mr-2 text-blue-600" />
                Command Reference
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search */}
            {searchable && (
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search ${command_type} commands...`}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          </div>

          {/* Command List */}
          <div className="flex-1 overflow-y-auto p-4">
            {filteredCommands.length === 0 ? (
              <div className="text-center text-slate-500 py-8">
                <p>No commands found</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredCommands.map((command, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedCommand(command)}
                    className="p-3 border border-slate-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-mono text-sm font-semibold text-slate-900">
                          {command.name}
                        </h3>
                        <p className="text-xs text-slate-600 mt-1">
                          {command.description}
                        </p>
                      </div>
                      <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                        {command.category}
                      </span>
                    </div>

                    {selectedCommand?.name === command.name && (
                      <div className="mt-3 pt-3 border-t border-slate-200 space-y-2">
                        <div>
                          <p className="text-xs font-semibold text-slate-700 mb-1">Syntax:</p>
                          <code className="text-xs bg-slate-100 p-2 rounded block">
                            {command.syntax}
                          </code>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-700 mb-1">Example:</p>
                          <code className="text-xs bg-green-50 text-green-800 p-2 rounded block">
                            {command.example}
                          </code>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
