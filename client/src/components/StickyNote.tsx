import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StickyNoteProps {
  children: React.ReactNode;
  color?: "yellow" | "pink" | "blue" | "green" | "white";
  className?: string;
  rotate?: number;
  delay?: number;
}

const colors = {
  yellow: "bg-yellow-200",
  pink: "bg-pink-200",
  blue: "bg-sky-200",
  green: "bg-green-200",
  white: "bg-white",
};

export function StickyNote({ 
  children, 
  color = "yellow", 
  className, 
  rotate = 0,
  delay = 0 
}: StickyNoteProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, rotate: rotate - 5 }}
      whileInView={{ opacity: 1, scale: 1, rotate: rotate }}
      viewport={{ once: true }}
      transition={{ 
        type: "spring", 
        stiffness: 200, 
        damping: 20, 
        delay: delay 
      }}
      whileHover={{ 
        scale: 1.02, 
        rotate: 0, 
        boxShadow: "10px 10px 0px 0px rgba(0,0,0,0.2)" 
      }}
      className={cn(
        colors[color],
        "p-6 shadow-brutal border-2 border-black relative",
        className
      )}
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-4 bg-black/5 -translate-y-2 blur-[1px] rounded-full opacity-0 hover:opacity-100 transition-opacity" />
      {children}
    </motion.div>
  );
}
