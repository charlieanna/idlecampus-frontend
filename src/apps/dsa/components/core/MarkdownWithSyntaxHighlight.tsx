import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface MarkdownWithSyntaxHighlightProps {
  children: string;
  className?: string;
}

export function MarkdownWithSyntaxHighlight({
  children,
  className = 'prose prose-slate max-w-none'
}: MarkdownWithSyntaxHighlightProps) {
  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : '';

            return !inline && language ? (
              <SyntaxHighlighter
                style={vscDarkPlus}
                language={language}
                PreTag="div"
                className="rounded-lg !mt-2 !mb-4"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className={`${className} bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-sm`} {...props}>
                {children}
              </code>
            );
          },
          pre({ children }) {
            return <>{children}</>;
          },
          table({ children }) {
            return (
              <div className="overflow-x-auto my-4">
                <table className="min-w-full border-collapse border border-slate-300 rounded-lg">
                  {children}
                </table>
              </div>
            );
          },
          thead({ children }) {
            return <thead className="bg-slate-100">{children}</thead>;
          },
          th({ children }) {
            return (
              <th className="border border-slate-300 px-4 py-2 text-left font-semibold text-slate-700">
                {children}
              </th>
            );
          },
          td({ children }) {
            return (
              <td className="border border-slate-300 px-4 py-2 text-slate-600">
                {children}
              </td>
            );
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
