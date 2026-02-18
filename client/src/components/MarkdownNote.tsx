import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type MarkdownNoteProps = {
  content: string;
  className?: string;
};

function renderInlineMarkdown(text: string): ReactNode[] {
  const tokens = text
    .split(/(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g)
    .filter(Boolean);

  return tokens.map((token, index) => {
    if (token.startsWith("**") && token.endsWith("**")) {
      return <strong key={index}>{token.slice(2, -2)}</strong>;
    }
    if (token.startsWith("`") && token.endsWith("`")) {
      return (
        <code key={index} className="px-1 py-0.5 bg-stone-200 border border-black/20 text-[0.9em]">
          {token.slice(1, -1)}
        </code>
      );
    }
    if (token.startsWith("*") && token.endsWith("*")) {
      return <em key={index}>{token.slice(1, -1)}</em>;
    }
    return <span key={index}>{token}</span>;
  });
}

export function MarkdownNote({ content, className }: MarkdownNoteProps) {
  const lines = content.replace(/\r\n/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  let bulletItems: string[] = [];
  let orderedItems: string[] = [];
  let keyIndex = 0;

  const flushBullets = () => {
    if (bulletItems.length === 0) return;
    blocks.push(
      <ul key={`ul-${keyIndex++}`} className="list-disc pl-5 space-y-1 font-mono text-sm leading-relaxed opacity-90">
        {bulletItems.map((item, itemIndex) => (
          <li key={`ul-item-${itemIndex}`}>{renderInlineMarkdown(item)}</li>
        ))}
      </ul>,
    );
    bulletItems = [];
  };

  const flushOrdered = () => {
    if (orderedItems.length === 0) return;
    blocks.push(
      <ol key={`ol-${keyIndex++}`} className="list-decimal pl-5 space-y-1 font-mono text-sm leading-relaxed opacity-90">
        {orderedItems.map((item, itemIndex) => (
          <li key={`ol-item-${itemIndex}`}>{renderInlineMarkdown(item)}</li>
        ))}
      </ol>,
    );
    orderedItems = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      flushBullets();
      flushOrdered();
      continue;
    }

    if (/^-{3,}$/.test(line)) {
      flushBullets();
      flushOrdered();
      blocks.push(<hr key={`hr-${keyIndex++}`} className="my-4 border-black/20" />);
      continue;
    }

    if (line.startsWith("- ")) {
      flushOrdered();
      bulletItems.push(line.slice(2).trim());
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      flushBullets();
      orderedItems.push(line.replace(/^\d+\.\s+/, "").trim());
      continue;
    }

    flushBullets();
    flushOrdered();

    if (line.startsWith("### ")) {
      blocks.push(
        <h3 key={`h3-${keyIndex++}`} className="font-serif text-2xl mt-6">
          {renderInlineMarkdown(line.slice(4))}
        </h3>,
      );
      continue;
    }

    if (line.startsWith("## ")) {
      blocks.push(
        <h2 key={`h2-${keyIndex++}`} className="font-serif text-3xl mt-8">
          {renderInlineMarkdown(line.slice(3))}
        </h2>,
      );
      continue;
    }

    if (line.startsWith("# ")) {
      blocks.push(
        <h1 key={`h1-${keyIndex++}`} className="font-serif text-4xl mt-8">
          {renderInlineMarkdown(line.slice(2))}
        </h1>,
      );
      continue;
    }

    blocks.push(
      <p key={`p-${keyIndex++}`} className="font-mono text-sm leading-relaxed opacity-90">
        {renderInlineMarkdown(line)}
      </p>,
    );
  }

  flushBullets();
  flushOrdered();

  return <div className={cn("space-y-3", className)}>{blocks}</div>;
}

