import { StickyNote } from "@/components/StickyNote";
import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";

const projects = [
  {
    title: "Project Alpha",
    description: "A comprehensive dashboard for financial analytics with real-time data visualization.",
    tags: ["React", "D3.js", "TypeScript"],
    color: "white"
  },
  {
    title: "Neon Dreams",
    description: "An immersive 3D experience built with Three.js exploring cyberpunk aesthetics.",
    tags: ["Three.js", "WebGL", "GSAP"],
    color: "pink"
  },
  {
    title: "Type Foundry",
    description: "E-commerce platform for independent type designers.",
    tags: ["Next.js", "Stripe", "Tailwind"],
    color: "yellow"
  },
  {
    title: "Mono UI",
    description: "An open-source component library focusing on monochromatic design systems.",
    tags: ["Open Source", "NPM", "Storybook"],
    color: "blue"
  }
];

export default function Projects() {
  return (
    <div>
      <h1 className="font-serif text-5xl md:text-7xl mb-12">Selected Works.</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.map((project, i) => (
          <StickyNote 
            key={i} 
            color={project.color as any}
            rotate={i % 2 === 0 ? 1 : -1}
            delay={i * 0.1}
            className="min-h-[300px] flex flex-col group"
          >
            <div className="flex-1">
              <h2 className="font-serif text-3xl mb-4 group-hover:underline decoration-2 underline-offset-4">{project.title}</h2>
              <p className="font-mono text-sm opacity-80 mb-6">{project.description}</p>
            </div>
            
            <div className="mt-auto">
              <div className="flex flex-wrap gap-2 mb-6">
                {project.tags.map(tag => (
                  <span key={tag} className="border border-black px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider">
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="flex gap-4 border-t border-black/10 pt-4">
                <button className="flex items-center gap-2 text-xs font-bold hover:opacity-60 transition-opacity">
                  <ExternalLink size={14} /> LIVE DEMO
                </button>
                <button className="flex items-center gap-2 text-xs font-bold hover:opacity-60 transition-opacity">
                  <Github size={14} /> SOURCE CODE
                </button>
              </div>
            </div>
          </StickyNote>
        ))}
      </div>
    </div>
  );
}
