import { Network } from 'lucide-react';
import { Card } from '../../components/ui/card';

export default function SystemDesignApp() {
  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
      <Card className="p-12 max-w-2xl text-center">
        <Network className="w-16 h-16 mx-auto mb-4 text-blue-600" />
        <h1 className="text-3xl font-bold mb-4 text-slate-900">
          System Design Course
        </h1>
        <p className="text-slate-600 mb-6">
          Learn to design scalable systems with interactive whiteboard, component library,
          and real-world scenarios.
        </p>
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-900 font-medium">
            🚀 Coming Soon!
          </p>
          <p className="text-sm text-blue-700 mt-2">
            This course will feature:
          </p>
          <ul className="text-left text-sm text-blue-700 mt-2 space-y-1">
            <li>• Interactive whiteboard canvas</li>
            <li>• Drag-and-drop components</li>
            <li>• System architecture patterns</li>
            <li>• Capacity estimation calculators</li>
            <li>• Trade-off analysis tools</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}
