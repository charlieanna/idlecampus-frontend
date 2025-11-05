import { Code } from 'lucide-react';
import { Card } from '../../components/ui/card';

export default function CodingInterviewApp() {
  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
      <Card className="p-12 max-w-2xl text-center">
        <Code className="w-16 h-16 mx-auto mb-4 text-purple-600" />
        <h1 className="text-3xl font-bold mb-4 text-slate-900">
          Coding Interview Course
        </h1>
        <p className="text-slate-600 mb-6">
          Master coding interviews with interactive problems, real-time code execution,
          and detailed solutions.
        </p>
        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-sm text-purple-900 font-medium">
            🚀 Coming Soon!
          </p>
          <p className="text-sm text-purple-700 mt-2">
            This course will feature:
          </p>
          <ul className="text-left text-sm text-purple-700 mt-2 space-y-1">
            <li>• Monaco Code Editor</li>
            <li>• Multiple programming languages</li>
            <li>• Test case validation</li>
            <li>• Time & space complexity analysis</li>
            <li>• Solution comparison</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}
