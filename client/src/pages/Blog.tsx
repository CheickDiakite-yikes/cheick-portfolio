import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import type { BlogPost } from "@shared/schema";

export default function Blog() {
  const { data: posts = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog?published=true"],
  });

  return (
    <div className="max-w-2xl">
      <h1 className="font-serif text-5xl md:text-7xl mb-12">Notes &<br />Thoughts.</h1>
      
      {isLoading ? (
        <div className="space-y-12">
          {[1, 2, 3].map(i => (
            <div key={i} className="space-y-3 animate-pulse">
              <div className="h-3 w-32 bg-stone-300" />
              <div className="h-8 w-full bg-stone-200" />
              <div className="h-4 w-3/4 bg-stone-200" />
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-hand text-3xl opacity-50">No posts yet...</p>
          <p className="font-mono text-sm mt-4 opacity-40">Words are brewing.</p>
        </div>
      ) : (
        <div className="space-y-12">
          {posts.map(post => (
            <article key={post.id} className="group cursor-pointer" data-testid={`card-post-${post.id}`}>
              <div className="flex items-baseline justify-between mb-2 border-b border-black pb-2">
                <span className="font-mono text-xs opacity-50">
                  {format(new Date(post.createdAt), "MMM dd, yyyy")}
                </span>
                <span className="font-mono text-xs bg-black text-white px-2 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity">READ</span>
              </div>
              <h2 className="font-serif text-3xl mb-3 group-hover:italic transition-all" data-testid={`text-post-title-${post.id}`}>
                {post.title}
              </h2>
              <p className="font-mono text-sm opacity-70 leading-relaxed" data-testid={`text-post-excerpt-${post.id}`}>
                {post.excerpt}
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
