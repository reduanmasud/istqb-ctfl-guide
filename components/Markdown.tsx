import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

const blockComponents: Components = {
  p: ({ children }) => (
    <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-slate-900">{children}</strong>
  ),
  em: ({ children }) => <em className="italic">{children}</em>,
  code: ({ children, className }) => {
    const isBlock = className?.startsWith("language-");
    if (isBlock) {
      return (
        <code className="block font-mono text-sm text-slate-200 whitespace-pre-wrap">
          {children}
        </code>
      );
    }
    return (
      <code className="font-mono text-[0.85em] bg-blue-50 text-blue-800 px-1.5 py-0.5 rounded border border-blue-100">
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre className="bg-slate-900 rounded-lg px-4 py-3 overflow-x-auto my-3 text-sm">
      {children}
    </pre>
  ),
  ul: ({ children }) => (
    <ul className="list-disc pl-5 space-y-1 my-2">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal pl-5 space-y-1 my-2">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  h1: ({ children }) => (
    <h1 className="text-xl font-bold text-slate-900 mt-4 mb-2">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-lg font-bold text-slate-900 mt-3 mb-1.5">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-base font-semibold text-slate-800 mt-2 mb-1">{children}</h3>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-blue-200 pl-4 italic text-slate-600 my-3">
      {children}
    </blockquote>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      className="text-blue-600 underline underline-offset-2 hover:text-blue-800"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto my-3">
      <table className="w-full text-sm border-collapse">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead>{children}</thead>,
  tbody: ({ children }) => <tbody>{children}</tbody>,
  tr: ({ children }) => <tr className="border-b border-blue-100">{children}</tr>,
  th: ({ children }) => (
    <th className="bg-blue-50 font-semibold text-slate-700 px-3 py-2 border border-blue-100 text-left">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-3 py-2 border border-blue-100 text-slate-700">{children}</td>
  ),
  hr: () => <hr className="border-blue-100 my-4" />,
};

/** Inline-only: no block wrappers — use inside buttons, list items, badges */
const inlineComponents: Components = {
  p: ({ children }) => <span>{children}</span>,
  strong: blockComponents.strong,
  em: blockComponents.em,
  code: blockComponents.code,
  a: blockComponents.a,
};

interface Props {
  children: string;
  /** Use "inline" inside buttons, list items, or anywhere a <p> would break layout */
  variant?: "block" | "inline";
  className?: string;
}

export function Markdown({ children, variant = "block", className }: Props) {
  const content = (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={variant === "inline" ? inlineComponents : blockComponents}
    >
      {children}
    </ReactMarkdown>
  );
  if (className) {
    return <div className={className}>{content}</div>;
  }
  return content;
}
