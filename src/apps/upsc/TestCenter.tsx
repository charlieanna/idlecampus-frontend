import { AlertCircle } from 'lucide-react';
export default function TestCenter() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Test Center</h1>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
        <AlertCircle className="w-12 h-12 text-blue-600 mx-auto mb-3" />
        <p className="text-slate-700">Test center coming soon!</p>
      </div>
    </div>
  );
}
