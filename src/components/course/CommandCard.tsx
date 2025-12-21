import { useState } from 'react';
import { CheckCircle2, Copy, Check, Terminal as TerminalIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

export interface Command {
  command: string;
  description: string;
  example: string;
}

export interface CommandCardProps {
  command: Command;
  state: 'current' | 'completed' | 'locked';
  commandIndex?: number;
  onCopy?: (command: string) => void;
}

export function CommandCard({ command, state, commandIndex, onCopy }: CommandCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    console.log('💡 CommandCard: Copy button clicked, command:', command.example);
    navigator.clipboard.writeText(command.example);
    setCopied(true);
    if (onCopy) {
      console.log('💡 CommandCard: Calling onCopy callback');
      onCopy(command.example);
    }
    setTimeout(() => setCopied(false), 2000);
  };

  const stateStyles = {
    current: 'bg-blue-50 border-blue-300 border-2 shadow-lg cursor-pointer',
    completed: 'bg-green-50 border-green-200',
    locked: 'bg-white border-slate-200'
  };

  const textStyles = {
    current: 'text-blue-700',
    completed: 'text-green-700',
    locked: 'text-slate-600'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1],
        delay: commandIndex ? commandIndex * 0.1 : 0
      }}
    >
      <Card
        className={`p-4 transition-all duration-300 ${stateStyles[state]}`}
        onClick={state === 'current' ? handleCopy : undefined}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            {/* Description - Show what the command does FIRST */}
            <p className={`text-base font-medium mb-3 ${
              state === 'current' ? 'text-blue-900' :
              state === 'completed' ? 'text-green-900' :
              'text-slate-700'
            }`}>
              {command.description}
            </p>

            {/* Command Name with Status */}
            <div className="flex items-center gap-2 mb-2">
              <code className={`px-2 py-1 rounded font-mono ${
                state === 'current' ? 'text-blue-700 bg-blue-100' :
                state === 'completed' ? 'text-green-700 bg-green-100' :
                'text-slate-600 bg-slate-100'
              }`}>
                {command.command}
              </code>

              {state === 'completed' && (
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              )}

              {state === 'current' && (
                <Badge className="bg-blue-600 animate-pulse">Practice this</Badge>
              )}
            </div>

            {/* Code Example with Copy Button */}
            <div className="bg-slate-900 text-green-400 p-3 rounded flex items-center justify-between group">
              <code className="text-sm font-mono flex-1">{command.example}</code>
              <Button
                size="sm"
                variant="ghost"
                className={`transition-opacity text-slate-400 hover:text-white h-6 w-6 p-0 ml-2 ${
                  state === 'current' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent card click when clicking button directly
                  handleCopy();
                }}
              >
                {copied ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </Button>
            </div>

            {/* Instruction for Current Command */}
            {state === 'current' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="mt-3 flex items-start gap-2 text-blue-700 text-sm"
              >
                <TerminalIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Type this command in the terminal on the right to continue</span>
              </motion.div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
