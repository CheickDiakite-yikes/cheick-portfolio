import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowLeft, Check, Copy, Share2 } from "lucide-react";
import { Link, useRoute } from "wouter";
import type { BlogPost as BlogPostType } from "@shared/schema";
import { MarkdownNote } from "@/components/MarkdownNote";
import { useToast } from "@/hooks/use-toast";

export default function BlogPost() {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [match, params] = useRoute("/blog/:id");
  const postId = match ? params.id : null;

  const { data, isLoading, error } = useQuery<BlogPostType>({
    queryKey: [`/api/blog/${postId}`],
    enabled: Boolean(postId),
  });

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 animate-pulse">
        <div className="h-8 w-32 bg-[hsl(var(--color-brand-yellow)/0.58)]" />
        <div className="h-16 w-3/4 bg-[hsl(var(--color-brand-yellow)/0.42)]" />
        <div className="h-80 w-full bg-[hsl(var(--color-brand-yellow)/0.42)]" />
      </div>
    );
  }

  if (!data || error) {
    return (
      <div className="max-w-3xl mx-auto">
        <Link href="/blog" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider border border-black px-3 py-2 hover:bg-black hover:text-[hsl(var(--color-brand-cream))] transition-colors mb-8">
          <ArrowLeft size={14} />
          Back to Blog
        </Link>
        <h1 className="font-serif text-4xl mb-4">Post not found.</h1>
        <p className="font-mono text-sm opacity-70">The requested post is unavailable.</p>
      </div>
    );
  }

  const post = data;
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`;
  const linkedInShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;

  async function copyLink() {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast({ title: "Link copied", description: "Blog link copied to clipboard." });
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      toast({ title: "Copy failed", description: "Please copy the URL manually.", variant: "destructive" });
    }
  }

  async function sharePost() {
    if (!shareUrl) return;
    if (typeof navigator === "undefined" || !navigator.share) {
      await copyLink();
      return;
    }

    try {
      await navigator.share({
        title: post.title,
        text: post.excerpt,
        url: shareUrl,
      });
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      toast({ title: "Share failed", description: "Please try copy link instead.", variant: "destructive" });
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <Link href="/blog" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider border border-black px-3 py-2 hover:bg-black hover:text-[hsl(var(--color-brand-cream))] transition-colors mb-8">
          <ArrowLeft size={14} />
          Back to Blog
        </Link>

        <p className="font-mono text-xs uppercase tracking-[0.18em] opacity-60 mb-3">
          {format(new Date(post.createdAt), "MMMM dd, yyyy")}
        </p>
        <h1 className="font-serif text-5xl md:text-7xl leading-[0.95] mb-4">{post.title}</h1>
        <p className="font-mono text-base leading-relaxed opacity-80">{post.excerpt}</p>

        <div className="mt-6 inline-flex flex-wrap items-center gap-2 border-2 border-black bg-[hsl(var(--color-brand-cream))] p-2 shadow-brutal">
          <button
            onClick={sharePost}
            className="inline-flex items-center gap-2 border border-black px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider hover:bg-[hsl(var(--color-brand-yellow)/0.38)] transition-colors"
            data-testid="button-share-native"
          >
            <Share2 size={13} />
            Share
          </button>
          <button
            onClick={copyLink}
            className="inline-flex items-center gap-2 border border-black px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider hover:bg-[hsl(var(--color-brand-cream)/0.9)] transition-colors"
            data-testid="button-share-copy"
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
            {copied ? "Copied" : "Copy Link"}
          </button>
          <a
            href={twitterShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center border border-black px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider hover:bg-black hover:text-[hsl(var(--color-brand-cream))] transition-colors"
          >
            Share on X
          </a>
          <a
            href={linkedInShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center border border-black px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider hover:bg-black hover:text-[hsl(var(--color-brand-cream))] transition-colors"
          >
            Share on LinkedIn
          </a>
        </div>
      </motion.div>

      <motion.article
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[hsl(var(--color-brand-cream))] border-4 border-black shadow-brutal p-6 md:p-10"
      >
        <MarkdownNote content={post.content} />
      </motion.article>
    </div>
  );
}
