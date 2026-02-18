import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Github, PlayCircle } from "lucide-react";
import { Link, useRoute } from "wouter";
import { MarkdownNote } from "@/components/MarkdownNote";

type ProjectLink = {
  label: string;
  url: string;
};

type ProjectDetailData = {
  id: number;
  title: string;
  description: string;
  color: string;
  tags: string[];
  liveUrl: string | null;
  sourceUrl: string | null;
  overview: string;
  techStack: string[];
  links: ProjectLink[];
  videoUrl: string | null;
  readme: string;
};

function convertToEmbedUrl(url: string): string {
  if (url.includes("youtube.com/embed/")) return url;
  const videoId = url.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{11})/)?.[1];
  return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
}

export default function ProjectDetail() {
  const [match, params] = useRoute("/projects/:id");
  const projectId = match ? params.id : null;

  const { data, isLoading, error } = useQuery<ProjectDetailData>({
    queryKey: [`/api/projects/${projectId}/details`],
    enabled: Boolean(projectId),
  });

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6 animate-pulse">
        <div className="h-8 w-32 bg-stone-300" />
        <div className="h-16 w-2/3 bg-stone-200" />
        <div className="h-40 w-full bg-stone-200" />
      </div>
    );
  }

  if (!data || error) {
    return (
      <div className="max-w-3xl mx-auto">
        <Link href="/projects" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider border border-black px-3 py-2 hover:bg-black hover:text-white transition-colors mb-8">
          <ArrowLeft size={14} />
          Back to Projects
        </Link>
        <h1 className="font-serif text-4xl mb-4">Project not found.</h1>
        <p className="font-mono text-sm opacity-70">This project dossier could not be loaded.</p>
      </div>
    );
  }

  const embedUrl = data.videoUrl ? convertToEmbedUrl(data.videoUrl) : null;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <Link href="/projects" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider border border-black px-3 py-2 hover:bg-black hover:text-white transition-colors mb-6">
          <ArrowLeft size={14} />
          Back to Projects
        </Link>

        <h1 className="font-serif text-5xl md:text-7xl mb-4">{data.title}.</h1>
        <p className="font-mono text-base leading-relaxed max-w-4xl opacity-90">{data.overview}</p>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_1fr] gap-8">
        <motion.section
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white border-4 border-black shadow-brutal p-6 md:p-8 space-y-6"
        >
          <div>
            <h2 className="font-mono text-xs uppercase tracking-[0.2em] opacity-60 mb-3">Project Links</h2>
            {data.links.length === 0 ? (
              <p className="font-mono text-sm opacity-60">No external links listed.</p>
            ) : (
              <div className="flex flex-wrap gap-3">
                {data.links.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border-2 border-black px-3 py-2 font-mono text-xs uppercase tracking-wider hover:bg-yellow-200 transition-colors"
                  >
                    {/github/i.test(link.label) ? <Github size={14} /> : <ExternalLink size={14} />}
                    {link.label}
                  </a>
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 className="font-mono text-xs uppercase tracking-[0.2em] opacity-60 mb-3">Tech Stack</h2>
            <div className="flex flex-wrap gap-2">
              {data.techStack.map((tag) => (
                <span key={tag} className="border border-black px-2 py-1 text-[11px] font-mono uppercase tracking-wide">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-mono text-xs uppercase tracking-[0.2em] opacity-60 mb-3">README</h2>
            {data.readme ? (
              <div className="border-2 border-black p-4 md:p-6 bg-stone-50 max-h-[900px] overflow-auto">
                <MarkdownNote content={data.readme} />
              </div>
            ) : (
              <p className="font-mono text-sm opacity-70">No README content captured for this project yet.</p>
            )}
          </div>
        </motion.section>

        <motion.aside
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {embedUrl ? (
            <div className="bg-black border-4 border-black shadow-brutal overflow-hidden">
              <div className="bg-yellow-200 text-black border-b-2 border-black px-4 py-2 font-mono text-xs uppercase tracking-wider flex items-center gap-2">
                <PlayCircle size={14} />
                Video Preview
              </div>
              <div className="aspect-video">
                <iframe
                  src={embedUrl}
                  title={`${data.title} demo`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            </div>
          ) : (
            <div className="bg-stone-200 border-4 border-black shadow-brutal p-8">
              <p className="font-hand text-2xl">No video preview listed for this project.</p>
            </div>
          )}

          <div className="bg-white border-4 border-black shadow-brutal p-6">
            <h3 className="font-serif text-2xl mb-3">Quick Summary</h3>
            <p className="font-mono text-sm leading-relaxed opacity-80">{data.description}</p>
          </div>
        </motion.aside>
      </div>
    </div>
  );
}

