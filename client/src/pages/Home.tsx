import { motion } from "framer-motion";
import { StickyNote } from "@/components/StickyNote";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  return (
    <div className="flex flex-col gap-12 pt-12 md:pt-24">
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl tracking-tight leading-[0.9]">
          Design<br />
          <span className="italic font-light opacity-50">&</span> Engineer
        </h1>
        <p className="font-mono text-xl mt-8 max-w-xl">
          Building digital experiences with a focus on motion, interaction, and brutalist aesthetics.
        </p>
      </motion.header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 relative">
        <StickyNote color="yellow" rotate={-2} className="min-h-[200px] flex flex-col justify-between">
          <span className="font-mono text-xs opacity-50">CURRENTLY</span>
          <p className="font-hand text-2xl">Building the next big thing in AI interfaces.</p>
          <div className="w-8 h-8 rounded-full bg-black/10 self-end" />
        </StickyNote>

        <StickyNote color="pink" rotate={3} delay={0.2} className="min-h-[200px] flex flex-col justify-between">
          <span className="font-mono text-xs opacity-50">LATEST WORK</span>
          <p className="font-serif text-xl italic">"The brutalist approach to modern web design."</p>
          <Link href="/projects">
            <a className="self-end hover:underline font-mono text-sm flex items-center gap-1">
              View Projects <ArrowRight size={14} />
            </a>
          </Link>
        </StickyNote>

        <StickyNote color="blue" rotate={-1} delay={0.4} className="hidden lg:flex min-h-[200px] flex-col justify-between">
          <span className="font-mono text-xs opacity-50">CONTACT</span>
          <p className="font-mono text-lg break-all">hello@portfolio.design</p>
          <Link href="/contact">
             <a className="self-end px-3 py-1 bg-black text-white font-mono text-xs hover:bg-black/80 transition-colors">
               SAY HELLO
             </a>
          </Link>
        </StickyNote>
      </div>
    </div>
  );
}
