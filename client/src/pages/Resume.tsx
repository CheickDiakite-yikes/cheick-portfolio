import { motion } from "framer-motion";
import { Download } from "lucide-react";

export default function Resume() {
  return (
    <div className="max-w-4xl mx-auto bg-white p-8 md:p-16 shadow-brutal-lg border-2 border-black my-8 relative">
      {/* Paper texture overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-multiply" />
      
      <div className="flex justify-between items-start mb-12 border-b-4 border-black pb-8">
        <div>
          <h1 className="font-serif text-4xl md:text-6xl mb-2">John Doe</h1>
          <p className="font-mono text-sm tracking-widest uppercase">Product Designer & Developer</p>
        </div>
        <button className="hidden md:flex items-center gap-2 bg-black text-white px-4 py-2 font-mono text-xs hover:bg-stone-800 transition-colors">
          <Download size={14} /> DOWNLOAD PDF
        </button>
      </div>

      <div className="space-y-12">
        <section>
          <h2 className="font-serif text-2xl mb-6 flex items-center gap-4">
            <span className="w-4 h-4 bg-black inline-block" /> Experience
          </h2>
          
          <div className="space-y-8 pl-8 border-l-2 border-black/10 ml-2">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="relative">
                <div className="absolute -left-[37px] top-1 w-3 h-3 rounded-full bg-black border-2 border-white" />
                <div className="flex justify-between items-baseline mb-2">
                  <h3 className="font-bold text-lg font-mono">Senior Product Designer</h3>
                  <span className="font-mono text-xs opacity-50">2023 - PRESENT</span>
                </div>
                <p className="font-serif italic opacity-70 mb-2">Tech Corp Inc.</p>
                <p className="font-mono text-sm leading-relaxed opacity-80">
                  Led the redesign of the core product interface, resulting in a 40% increase in user engagement.
                  Managed a team of 3 junior designers and established a new design system.
                </p>
              </div>
            ))}
          </div>
        </section>

        <section>
           <h2 className="font-serif text-2xl mb-6 flex items-center gap-4">
            <span className="w-4 h-4 bg-black inline-block" /> Education
          </h2>
          <div className="pl-8 ml-2">
            <div className="mb-4">
              <h3 className="font-bold text-lg font-mono">BFA in Interaction Design</h3>
              <p className="font-serif italic opacity-70">California College of the Arts</p>
              <span className="font-mono text-xs opacity-50">2015 - 2019</span>
            </div>
          </div>
        </section>
        
        <section>
           <h2 className="font-serif text-2xl mb-6 flex items-center gap-4">
            <span className="w-4 h-4 bg-black inline-block" /> Skills
          </h2>
          <div className="pl-8 ml-2 flex flex-wrap gap-3">
            {["UI/UX", "React", "TypeScript", "Node.js", "Figma", "After Effects", "Blender", "WebGL"].map(skill => (
              <span key={skill} className="border border-black px-3 py-1 font-mono text-sm hover:bg-black hover:text-white transition-colors cursor-default">
                {skill}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
