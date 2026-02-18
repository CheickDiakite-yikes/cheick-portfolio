import { Link } from "wouter";

const posts = [
  {
    id: 1,
    title: "The Return of Brutalism in Web Design",
    date: "Oct 12, 2025",
    excerpt: "Why we are seeing a resurgence of raw, unpolished aesthetics in modern digital interfaces."
  },
  {
    id: 2,
    title: "Motion as a Material",
    date: "Sep 28, 2025",
    excerpt: "Treating animation not as an afterthought, but as a core building block of the user experience."
  },
  {
    id: 3,
    title: "Designing for the Void",
    date: "Aug 15, 2025",
    excerpt: "Embracing negative space and minimalism without losing personality."
  }
];

export default function Blog() {
  return (
    <div className="max-w-2xl">
      <h1 className="font-serif text-5xl md:text-7xl mb-12">Notes &<br />Thoughts.</h1>
      
      <div className="space-y-12">
        {posts.map(post => (
          <article key={post.id} className="group cursor-pointer">
            <div className="flex items-baseline justify-between mb-2 border-b border-black pb-2">
              <span className="font-mono text-xs opacity-50">{post.date}</span>
              <span className="font-mono text-xs bg-black text-white px-2 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity">READ</span>
            </div>
            <h2 className="font-serif text-3xl mb-3 group-hover:italic transition-all">{post.title}</h2>
            <p className="font-mono text-sm opacity-70 leading-relaxed">
              {post.excerpt}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
