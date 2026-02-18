import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link, useRoute } from "wouter";
import type { BlogPost as BlogPostType } from "@shared/schema";
import { MarkdownNote } from "@/components/MarkdownNote";

export default function BlogPost() {
  const [match, params] = useRoute("/blog/:id");
  const postId = match ? params.id : null;

  const { data, isLoading, error } = useQuery<BlogPostType>({
    queryKey: [`/api/blog/${postId}`],
    enabled: Boolean(postId),
  });

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 animate-pulse">
        <div className="h-8 w-32 bg-stone-300" />
        <div className="h-16 w-3/4 bg-stone-200" />
        <div className="h-80 w-full bg-stone-200" />
      </div>
    );
  }

  if (!data || error) {
    return (
      <div className="max-w-3xl mx-auto">
        <Link href="/blog" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider border border-black px-3 py-2 hover:bg-black hover:text-white transition-colors mb-8">
          <ArrowLeft size={14} />
          Back to Blog
        </Link>
        <h1 className="font-serif text-4xl mb-4">Post not found.</h1>
        <p className="font-mono text-sm opacity-70">The requested post is unavailable.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <Link href="/blog" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider border border-black px-3 py-2 hover:bg-black hover:text-white transition-colors mb-8">
          <ArrowLeft size={14} />
          Back to Blog
        </Link>

        <p className="font-mono text-xs uppercase tracking-[0.18em] opacity-60 mb-3">
          {format(new Date(data.createdAt), "MMMM dd, yyyy")}
        </p>
        <h1 className="font-serif text-5xl md:text-7xl leading-[0.95] mb-4">{data.title}</h1>
        <p className="font-mono text-base leading-relaxed opacity-80">{data.excerpt}</p>
      </motion.div>

      <motion.article
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border-4 border-black shadow-brutal p-6 md:p-10"
      >
        <MarkdownNote content={data.content} />
      </motion.article>
    </div>
  );
}

