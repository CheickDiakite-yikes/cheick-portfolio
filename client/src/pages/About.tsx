import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowLeft, Rocket, Moon } from "lucide-react";

export default function About() {
  const [avatarMissing, setAvatarMissing] = useState(false);

  return (
    <div className="max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <Link href="/" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider border border-black px-3 py-2 hover:bg-black hover:text-white transition-colors">
          <ArrowLeft size={14} />
          Back
        </Link>
        <p className="font-mono text-xs uppercase tracking-[0.18em] opacity-60">PERSONAL DATABASE</p>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="font-serif text-5xl md:text-7xl mb-10"
      >
        PROFILE_LOG.
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-8 mb-10">
        <div className="relative border-4 border-black bg-stone-200 aspect-square flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.08)_50%)] bg-[length:100%_4px]" />
          {avatarMissing ? (
            <span className="font-serif text-6xl italic">CD</span>
          ) : (
            <img
              src="/cheick-avatar.jpg"
              alt="Cheick Diakite"
              className="w-full h-full object-cover"
              onError={() => setAvatarMissing(true)}
            />
          )}
          <div className="absolute -bottom-3 -right-2 rotate-[-6deg] bg-yellow-300 border-2 border-black px-3 py-1 font-mono text-[10px] uppercase tracking-wider">
            LVL 99 ENGINEER
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="font-mono text-xs uppercase tracking-[0.2em] opacity-60">ABOUT_ME.exe</h2>
          <p className="font-mono text-base leading-relaxed">
            AI-native Google DeepMind Hackathon Winner combining <span className="bg-yellow-200 px-1">$11B+</span> in IB/PE M&A transaction experience with hands-on AI engineering.
          </p>
          <p className="font-mono text-base leading-relaxed">
            Former Banker/Investor turned Techstars-backed Founder who has architected and built LLM-powered agents and workflows and evaluated 130+ private market deals.
          </p>
          <p className="font-mono text-base leading-relaxed">
            Proven ability to bridge technical feasibility and business viability, translating "boardroom strategy" into shipped code and 0-&gt;1 product execution.
          </p>
        </div>
      </div>

      <div className="my-10 p-6 border-4 border-black bg-stone-100 relative">
        <div className="absolute -top-4 left-4 bg-black text-white px-3 py-1 font-mono text-[10px] tracking-wider">
          OBJECTIVE
        </div>
        <p className="font-hand text-2xl md:text-3xl leading-tight">
          Looking to apply this "boardroom-to-code" fluency to drive strategy and innovation within a top-tier AI focused organization over the next several years.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 bg-sky-200 border-2 border-black font-mono text-xs uppercase tracking-wider hover:translate-y-[-2px] transition-transform">
          <Rocket size={14} />
          Return to Ship
        </Link>
        <Link href="/?view=moon" className="inline-flex items-center gap-2 px-4 py-2 bg-violet-200 border-2 border-black font-mono text-xs uppercase tracking-wider hover:translate-y-[-2px] transition-transform">
          <Moon size={14} />
          Return to Moon
        </Link>
      </div>
    </div>
  );
}
