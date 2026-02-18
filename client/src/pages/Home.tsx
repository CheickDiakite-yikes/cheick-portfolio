import { motion } from "framer-motion";
import { StickyNote } from "@/components/StickyNote";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { Typewriter } from "@/components/Typewriter";

export default function Home() {
  const activities = [
    "Building LLM-powered products end-to-end.",
    "Designing AI workflows for real users.",
    "Testing frontier models across OpenAI and Gemini.",
    "Shipping private equity tooling that saves teams hours.",
    "Mentoring and learning with other builders.",
    "Training hard and staying balanced."
  ];

  return (
    <div className="flex flex-col gap-12 pt-12 md:pt-24">
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative"
      >
        <div className="absolute -top-8 left-0">
          <span className="font-hand text-xl opacity-40 rotate-[-2deg] inline-block">Cheick Diakite</span>
        </div>
        <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl tracking-tight leading-[0.9]">
          AI, Product<br />
          <span className="italic font-light opacity-50">&</span> Finance
        </h1>
        <p className="font-mono text-xl mt-8 max-w-xl">
          Google DeepMind Hackathon Winner blending $11B+ in IB/PE M&A experience with hands-on AI engineering and 0→1 product execution.
        </p>
      </motion.header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 relative">
        <StickyNote color="yellow" rotate={-2} className="min-h-[200px] flex flex-col justify-between overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="font-mono text-xs opacity-50">CURRENTLY</span>
          </div>
          
          <div className="relative font-hand text-2xl leading-tight min-h-[3em]">
             <Typewriter phrases={activities} />
          </div>
          
          <div className="w-8 h-8 rounded-full bg-black/10 self-end mt-4" />
        </StickyNote>

        <StickyNote color="pink" rotate={3} delay={0.2} className="min-h-[200px] flex flex-col justify-between">
          <span className="font-mono text-xs opacity-50">LATEST WORK</span>
          <p className="font-serif text-xl italic">"AI-native products for investing, education, creativity, and wellness."</p>
          <Link href="/projects" className="self-end hover:underline font-mono text-sm flex items-center gap-1">
              View Projects <ArrowRight size={14} />
          </Link>
        </StickyNote>

        <StickyNote color="blue" rotate={-1} delay={0.4} className="hidden lg:flex min-h-[200px] flex-col justify-between">
          <span className="font-mono text-xs opacity-50">CONTACT</span>
          <p className="font-mono text-lg break-all">contact@cheickdiakite.com</p>
          <Link href="/contact" className="self-end px-3 py-1 bg-black text-white font-mono text-xs hover:bg-black/80 transition-colors">
               SAY HELLO
          </Link>
        </StickyNote>
      </div>
    </div>
  );
}
