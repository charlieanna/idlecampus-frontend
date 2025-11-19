import { ReactNode } from 'react';

// Reusable lesson content components with Tailwind styling

export function H1({ children }: { children: ReactNode }) {
  return <h1 className="text-3xl font-bold text-slate-900 mb-6 mt-8 first:mt-0 border-b-2 border-slate-200 pb-2">{children}</h1>;
}

export function H2({ children }: { children: ReactNode }) {
  return <h2 className="text-2xl font-bold text-slate-800 mb-4 mt-8">{children}</h2>;
}

export function H3({ children }: { children: ReactNode }) {
  return <h3 className="text-xl font-semibold text-slate-700 mb-3 mt-6">{children}</h3>;
}

export function P({ children }: { children: ReactNode }) {
  return <p className="text-slate-600 leading-relaxed mb-4 text-base">{children}</p>;
}

export function Strong({ children }: { children: ReactNode }) {
  return <strong className="font-semibold text-slate-900">{children}</strong>;
}

export function Em({ children }: { children: ReactNode }) {
  return <em className="italic text-slate-700">{children}</em>;
}

export function Code({ children }: { children: ReactNode }) {
  return (
    <code className="px-2 py-0.5 bg-rose-50 text-rose-700 rounded font-mono text-sm border border-rose-200">
      {children}
    </code>
  );
}

export function CodeBlock({ children, language }: { children: string; language?: string }) {
  return (
    <pre className="bg-slate-900 text-slate-100 rounded-lg p-5 overflow-x-auto my-5 font-mono text-sm shadow-lg border border-slate-700">
      <code>{children}</code>
    </pre>
  );
}

export function UL({ children }: { children: ReactNode }) {
  return <ul className="list-disc pl-6 space-y-2.5 my-5 marker:text-blue-500">{children}</ul>;
}

export function OL({ children }: { children: ReactNode }) {
  return <ol className="list-decimal pl-6 space-y-2.5 my-5 marker:text-blue-500">{children}</ol>;
}

export function LI({ children }: { children: ReactNode }) {
  return <li className="text-slate-600 leading-relaxed">{children}</li>;
}

export function Link({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} className="text-blue-600 hover:text-blue-700 underline underline-offset-2 font-medium" target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

export function Blockquote({ children }: { children: ReactNode }) {
  return (
    <blockquote className="border-l-4 border-blue-400 pl-5 italic text-slate-700 my-5 bg-blue-50 py-4 rounded-r-lg">
      {children}
    </blockquote>
  );
}

export function Table({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto my-6 rounded-lg border border-slate-200 shadow-sm">
      <table className="min-w-full border-collapse">
        {children}
      </table>
    </div>
  );
}

export function TH({ children }: { children: ReactNode }) {
  return (
    <th className="border-b border-slate-200 bg-slate-50 px-5 py-3 text-left font-semibold text-slate-900 text-sm">
      {children}
    </th>
  );
}

export function TD({ children }: { children: ReactNode }) {
  return <td className="border-b border-slate-200 px-5 py-3 text-slate-600 text-sm">{children}</td>;
}

export function InfoBox({ children, type = 'info' }: { children: ReactNode; type?: 'info' | 'warning' | 'success' | 'error' }) {
  const colors = {
    info: 'bg-blue-50 border-blue-300 text-blue-900',
    warning: 'bg-amber-50 border-amber-300 text-amber-900',
    success: 'bg-emerald-50 border-emerald-300 text-emerald-900',
    error: 'bg-red-50 border-red-300 text-red-900',
  };

  return (
    <div className={`border-l-4 p-5 my-5 rounded-r-lg shadow-sm ${colors[type]}`}>
      {children}
    </div>
  );
}

export function Section({ children }: { children: ReactNode }) {
  return <section className="space-y-5">{children}</section>;
}

export function Divider() {
  return <hr className="my-10 border-slate-200" />;
}

export function ComparisonTable({ 
  headers, 
  rows 
}: { 
  headers: string[]; 
  rows: string[][];
}) {
  return (
    <Table>
      <thead>
        <tr>
          {headers.map((header, i) => (
            <TH key={i}>{header}</TH>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i}>
            {row.map((cell, j) => (
              <TD key={j}>{cell}</TD>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export function KeyPoint({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-4 p-5 bg-gradient-to-r from-violet-50 to-purple-50 border-l-4 border-violet-500 rounded-r-lg my-6 shadow-sm">
      <span className="text-violet-600 text-2xl flex-shrink-0">💡</span>
      <div className="text-slate-800 font-medium">{children}</div>
    </div>
  );
}

export function Example({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 my-5 shadow-sm">
      {title && <div className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
        <span className="text-blue-600">📝</span>
        {title}
      </div>}
      <div className="text-slate-700">{children}</div>
    </div>
  );
}

