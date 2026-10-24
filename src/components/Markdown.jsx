import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";

//Renders a recipe's story. Three layers keep user Markdown from becoming
//user HTML:
//  1. react-markdown never parses raw HTML into elements without rehype-raw,
//     and skipHtml drops the raw nodes entirely.
//  2. rehype-sanitize runs with the allowlist below: a dozen text elements,
//     href on links (http, https, mailto only), nothing else. No images (the
//     photo gallery is for that), no ids or classes, no inline styles.
//  3. The output is React elements, so there is no innerHTML anywhere.
//Headings are demoted so the page keeps one h1: # and ## render as h2,
//### as h3, #### as h4.

const schema = {
  ...defaultSchema,
  tagNames: [
    "p", "br", "strong", "em", "del", "a",
    "ul", "ol", "li", "blockquote", "hr",
    "h1", "h2", "h3", "h4",
    "code", "pre",
    "table", "thead", "tbody", "tr", "th", "td",
  ],
  attributes: {
    a: ["href"],
    ol: ["start"],
    th: ["align"],
    td: ["align"],
  },
  protocols: { href: ["http", "https", "mailto"] },
  //Nothing is renamed, so no clobber prefix is needed.
  clobber: [],
};

const H2 = ({ children }) => <h2 className="font-display mt-10 text-3xl leading-tight first:mt-0">{children}</h2>;
const components = {
  h1: H2,
  h2: H2,
  h3: ({ children }) => <h3 className="mt-8 text-xl font-semibold">{children}</h3>,
  h4: ({ children }) => <h4 className="mt-6 text-lg font-semibold">{children}</h4>,
  p: ({ children }) => <p className="leading-relaxed text-white/90">{children}</p>,
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer nofollow ugc" className="underline decoration-white/50 underline-offset-4 hover:decoration-white">
      {children}
    </a>
  ),
  ul: ({ children }) => <ul className="list-disc space-y-1.5 pl-6 text-white/90 marker:text-white/50">{children}</ul>,
  ol: ({ children, start }) => <ol start={start} className="list-decimal space-y-1.5 pl-6 text-white/90 marker:text-white/50">{children}</ol>,
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="border-l border-white/40 pl-4 text-white/75 italic">{children}</blockquote>
  ),
  hr: () => <hr className="my-8 border-white/15" />,
  code: ({ children }) => <code className="rounded bg-white/10 px-1.5 py-0.5 text-[0.9em]">{children}</code>,
  pre: ({ children }) => <pre className="overflow-x-auto rounded-xl bg-white/5 p-4 text-sm leading-relaxed">{children}</pre>,
  table: ({ children }) => (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">{children}</table>
    </div>
  ),
  th: ({ children, align }) => <th align={align} className="border-b border-white/30 px-3 py-2 font-semibold">{children}</th>,
  td: ({ children, align }) => <td align={align} className="border-b border-white/10 px-3 py-2 text-white/90">{children}</td>,
};

export default function Markdown({ children, className = "" }) {
  return (
    <div className={`space-y-4 break-words ${className}`}>
      <ReactMarkdown
        skipHtml
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[[rehypeSanitize, schema]]}
        components={components}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
