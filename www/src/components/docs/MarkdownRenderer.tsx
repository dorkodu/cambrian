import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
  content: string;
}

const components: Components = {
  // Headings with anchor links
  h1: ({ children, ...props }) => (
    <h1 className="mb-6 text-3xl font-bold tracking-tight" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }) => (
    <h2 className="mb-4 mt-10 text-2xl font-semibold tracking-tight border-b border-border pb-2" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 className="mb-3 mt-8 text-xl font-semibold" {...props}>
      {children}
    </h3>
  ),
  h4: ({ children, ...props }) => (
    <h4 className="mb-2 mt-6 text-lg font-medium" {...props}>
      {children}
    </h4>
  ),

  // Paragraphs
  p: ({ children, ...props }) => (
    <p className="mb-4 leading-7 text-muted-foreground" {...props}>
      {children}
    </p>
  ),

  // Links
  a: ({ href, children, ...props }) => (
    <a
      href={href}
      className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
      {...props}
    >
      {children}
    </a>
  ),

  // Lists
  ul: ({ children, ...props }) => (
    <ul className="mb-4 ml-6 list-disc space-y-2" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol className="mb-4 ml-6 list-decimal space-y-2" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li className="leading-7 text-muted-foreground" {...props}>
      {children}
    </li>
  ),

  // Code blocks
  pre: ({ children, ...props }) => (
    <pre
      className="mb-4 overflow-x-auto rounded-lg border border-border bg-muted/50 p-4 font-mono text-sm"
      {...props}
    >
      {children}
    </pre>
  ),
  code: ({ className, children, ...props }) => {
    const isInline = !className;
    if (isInline) {
      return (
        <code
          className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm"
          {...props}
        >
          {children}
        </code>
      );
    }
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },

  // Blockquotes
  blockquote: ({ children, ...props }) => (
    <blockquote
      className="mb-4 border-l-4 border-primary/50 pl-4 italic text-muted-foreground"
      {...props}
    >
      {children}
    </blockquote>
  ),

  // Tables
  table: ({ children, ...props }) => (
    <div className="mb-4 overflow-x-auto">
      <table className="w-full border-collapse text-sm" {...props}>
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }) => (
    <thead className="border-b border-border" {...props}>
      {children}
    </thead>
  ),
  th: ({ children, ...props }) => (
    <th className="px-4 py-2 text-left font-semibold" {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }) => (
    <td className="border-t border-border px-4 py-2 text-muted-foreground" {...props}>
      {children}
    </td>
  ),

  // Horizontal rule
  hr: () => <hr className="my-8 border-border" />,

  // Strong and emphasis
  strong: ({ children, ...props }) => (
    <strong className="font-semibold text-foreground" {...props}>
      {children}
    </strong>
  ),
};

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose-cambrian">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
