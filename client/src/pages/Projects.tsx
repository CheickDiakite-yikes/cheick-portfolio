import { useState, useMemo, useRef, useEffect } from "react";
import { StickyNote } from "@/components/StickyNote";
import { ExternalLink, Github, FileText, Filter, X, ChevronDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Project } from "@shared/schema";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";

const TAG_CATEGORIES: Record<string, string[]> = {
  "AI Models": [
    "GPT-4", "GPT-4o", "GPT-4o-mini", "GPT-5.1",
    "Gemini 2.0 Flash", "Gemini 2.5", "Gemini 2.5 Flash", "Gemini 2.5 Pro",
    "Gemini 3 Flash", "Gemini 3 Pro", "Gemini 3 Pro Image",
    "Gemini API", "Gemini Vision", "Gemini Live API",
    "Multi-Agent AI", "Multi-Agent Swarm",
  ],
  "Media AI": [
    "DALL-E 3", "Imagen 4.0", "Lyria", "Veo3", "Veo 3.1",
    "Gemini TTS", "Gemini 2.5 Flash Native Audio", "Azure TTS", "LlamaParse",
  ],
  "Frontend": [
    "React", "React 18", "React 19", "TypeScript", "Tailwind CSS",
    "HTML5 Canvas", "HTML5/CSS3", "Recharts", "3D Effects",
  ],
  "Backend": [
    "Express.js", "Express 5", "Flask", "PostgreSQL", "Drizzle ORM",
    "Passport.js", "Multer", "IndexedDB",
  ],
};

function FilterDropdown({
  label,
  tags,
  activeFilter,
  onSelect,
  projects,
}: {
  label: string;
  tags: string[];
  activeFilter: string | null;
  onSelect: (tag: string | null) => void;
  projects: Project[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const hasActive = activeFilter && tags.includes(activeFilter);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`
          flex items-center gap-2 border-2 border-black px-4 py-2.5 font-mono text-xs uppercase tracking-wider
          transition-all duration-150 cursor-pointer
          ${hasActive
            ? "bg-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]"
            : "bg-white hover:bg-stone-50 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.15)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.25)]"
          }
        `}
        data-testid={`dropdown-${label}`}
      >
        <span className="font-hand text-sm normal-case tracking-normal">{label}</span>
        {hasActive && (
          <span className="bg-white text-black px-1.5 py-0.5 text-[10px] font-bold leading-none">
            {activeFilter}
          </span>
        )}
        <ChevronDown size={14} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-2 z-50 min-w-[220px] bg-white border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)] max-h-[320px] overflow-y-auto"
          >
            {tags.map(tag => {
              const isActive = activeFilter === tag;
              const count = projects.filter(p => p.tags.includes(tag)).length;
              return (
                <button
                  key={tag}
                  onClick={() => {
                    onSelect(isActive ? null : tag);
                    setOpen(false);
                  }}
                  className={`
                    w-full text-left px-4 py-2.5 font-mono text-xs flex items-center justify-between
                    transition-colors duration-100 border-b border-black/5 last:border-b-0
                    ${isActive ? "bg-black text-white" : "hover:bg-stone-100"}
                  `}
                  data-testid={`button-filter-${tag}`}
                >
                  <span className="uppercase tracking-wider">{tag}</span>
                  <span className={`text-[10px] font-bold ${isActive ? "opacity-60" : "opacity-40"}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Projects() {
  const [, setLocation] = useLocation();
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    projects.forEach(p => p.tags.forEach(t => tagSet.add(t)));
    return Array.from(tagSet).sort();
  }, [projects]);

  const categoryTags = useMemo(() => {
    const cats: Record<string, string[]> = {};
    for (const [category, catTags] of Object.entries(TAG_CATEGORIES)) {
      const available = catTags.filter(t => allTags.includes(t));
      if (available.length > 0) cats[category] = available;
    }
    return cats;
  }, [allTags]);

  const filteredProjects = useMemo(() => {
    if (!activeFilter) return projects;
    return projects.filter(p => p.tags.includes(activeFilter));
  }, [projects, activeFilter]);

  return (
    <div>
      <h1 className="font-serif text-5xl md:text-7xl mb-8">Selected Works.</h1>

      <div className="mb-10 border-2 border-black bg-white/80 shadow-brutal p-4 md:p-6" data-testid="filter-bar">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Filter size={18} className="opacity-60" />
            <span className="font-mono text-xs uppercase tracking-widest opacity-60">Filter by tech</span>
          </div>
          <div className="flex items-center gap-3">
            {activeFilter && (
              <button
                onClick={() => setActiveFilter(null)}
                className="flex items-center gap-1 font-mono text-xs bg-black text-white px-3 py-1 hover:bg-black/80 transition-colors"
                data-testid="button-clear-filter"
              >
                <X size={12} /> CLEAR
              </button>
            )}
            <span className="font-mono text-sm font-bold tabular-nums" data-testid="text-project-count">
              {filteredProjects.length} {filteredProjects.length === 1 ? "project" : "projects"}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {Object.entries(categoryTags).map(([category, tags]) => (
            <FilterDropdown
              key={category}
              label={category}
              tags={tags}
              activeFilter={activeFilter}
              onSelect={setActiveFilter}
              projects={projects}
            />
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="min-h-[300px] bg-stone-200 border-2 border-black/10 animate-pulse" />
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-hand text-3xl opacity-50">No projects match that filter...</p>
          <button
            onClick={() => setActiveFilter(null)}
            className="font-mono text-sm mt-4 underline opacity-60 hover:opacity-100"
          >
            Show all projects
          </button>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter || "all"}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {filteredProjects.map((project, i) => (
              <StickyNote
                key={project.id}
                color={project.color as any}
                rotate={i % 2 === 0 ? 1 : -1}
                delay={i * 0.05}
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
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
