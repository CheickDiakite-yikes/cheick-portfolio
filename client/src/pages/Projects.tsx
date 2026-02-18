import { StickyNote } from "@/components/StickyNote";
import { ExternalLink, Github, FileText } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Project } from "@shared/schema";
import { useLocation } from "wouter";

export default function Projects() {
  const [, setLocation] = useLocation();
  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  return (
    <div>
      <h1 className="font-serif text-5xl md:text-7xl mb-12">Selected Works.</h1>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="min-h-[300px] bg-stone-200 border-2 border-black/10 animate-pulse" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-hand text-3xl opacity-50">No projects yet...</p>
          <p className="font-mono text-sm mt-4 opacity-40">Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, i) => (
            <StickyNote 
              key={project.id} 
              color={project.color as any}
              rotate={i % 2 === 0 ? 1 : -1}
              delay={i * 0.1}
              className="min-h-[300px] flex flex-col group cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black/50 focus-visible:ring-offset-2"
              onClick={() => setLocation(`/projects/${project.id}`)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setLocation(`/projects/${project.id}`);
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={`Open ${project.title} details`}
            >
              <div className="flex-1">
                <h2 className="font-serif text-3xl mb-4 group-hover:underline decoration-2 underline-offset-4" data-testid={`text-project-title-${project.id}`}>
                  {project.title}
                </h2>
                <p className="font-mono text-sm opacity-80 mb-6" data-testid={`text-project-desc-${project.id}`}>
                  {project.description}
                </p>
              </div>
              
              <div className="mt-auto">
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags.map(tag => (
                    <span key={tag} className="border border-black px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex flex-wrap gap-4 border-t border-black/10 pt-4">
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      setLocation(`/projects/${project.id}`);
                    }}
                    className="flex items-center gap-2 text-xs font-bold hover:opacity-60 transition-opacity"
                    data-testid={`link-details-${project.id}`}
                  >
                    <FileText size={14} /> VIEW DOSSIER
                  </button>
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs font-bold hover:opacity-60 transition-opacity"
                      onClick={(event) => event.stopPropagation()}
                      data-testid={`link-live-${project.id}`}
                    >
                      <ExternalLink size={14} /> LIVE DEMO
                    </a>
                  )}
                  {project.sourceUrl && (
                    <a
                      href={project.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs font-bold hover:opacity-60 transition-opacity"
                      onClick={(event) => event.stopPropagation()}
                      data-testid={`link-source-${project.id}`}
                    >
                      <Github size={14} /> SOURCE CODE
                    </a>
                  )}
                </div>
              </div>
            </StickyNote>
          ))}
        </div>
      )}
    </div>
  );
}
