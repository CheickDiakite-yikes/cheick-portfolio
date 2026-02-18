import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

const links = [
  { href: "/", label: "Home", color: "bg-yellow-200" },
  { href: "/about", label: "About", color: "bg-pink-200" },
  { href: "/projects", label: "Projects", color: "bg-sky-200" },
  { href: "/resume", label: "Resume", color: "bg-green-200" },
  { href: "/blog", label: "Blog", color: "bg-purple-200" },
  { href: "/guestbook", label: "Guestbook", color: "bg-orange-200" },
  { href: "/contact", label: "Contact", color: "bg-rose-200" },
  { href: "/admin", label: "Admin", color: "bg-stone-200" },
];

export function Navigation() {
  const [location] = useLocation();

  return (
    <nav className="fixed left-0 top-0 h-screen w-64 bg-stone-100 border-r-4 border-black hidden md:flex flex-col p-8 z-50">
      <div className="mb-12">
        <h1 className="font-serif text-4xl font-bold italic tracking-tighter hover:scale-105 transition-transform cursor-default origin-left">
          Portfolio.
        </h1>
        <p className="font-mono text-xs mt-2 opacity-60">EST. 2026</p>
      </div>

      <div className="flex flex-col gap-4">
        {links.map((link) => {
          const isActive = location === link.href;
          return (
            <Link key={link.href} href={link.href}>
              <a className="group relative flex items-center">
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute -left-4 w-2 h-2 bg-black rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span
                  className={cn(
                    "font-mono text-lg transition-all duration-300 group-hover:pl-4 group-hover:font-bold",
                    isActive ? "font-bold underline decoration-2 underline-offset-4" : "opacity-60 hover:opacity-100"
                  )}
                >
                  {link.label}
                </span>
                <ArrowRight 
                  className="absolute right-0 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" 
                  size={16} 
                />
              </a>
            </Link>
          );
        })}
      </div>

      <div className="mt-auto">
        <div className="w-full h-[1px] bg-black/20 mb-4" />
        <motion.p 
          animate={{ rotate: [-2, 2, -2] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="font-hand text-sm origin-center inline-block cursor-help"
        >
          "Make it nice!"
        </motion.p>
      </div>
    </nav>
  );
}

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <>
      {/* Floating Action Button */}
      <div className="md:hidden fixed bottom-6 right-6 z-[60]">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.1, rotate: 90 }}
          className="bg-black text-white w-16 h-16 flex items-center justify-center rounded-full shadow-brutal border-2 border-white"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </motion.button>
      </div>

      {/* Full Screen Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute bottom-0 left-0 w-full h-[85vh] bg-stone-100 rounded-t-[40px] border-t-4 border-black overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-1 bg-black/20 mx-auto mt-6 rounded-full" />
              
              <div className="p-8 flex flex-col gap-4 overflow-y-auto pb-24">
                <h2 className="font-serif text-4xl mb-4 italic">Menu.</h2>
                
                {links.map((link, i) => (
                  <Link key={link.href} href={link.href}>
                    <motion.a
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      whileTap={{ scale: 0.98 }}
                      className={cn(
                        "block p-6 border-2 border-black shadow-brutal-sm font-mono text-xl uppercase font-bold tracking-wider active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all",
                        link.color,
                        location === link.href && "ring-4 ring-black ring-offset-2"
                      )}
                    >
                      {link.label}
                    </motion.a>
                  </Link>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Bottom Bar (Static indicator when menu is closed) */}
      {!isOpen && (
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="md:hidden fixed bottom-0 left-0 w-full bg-stone-100/80 backdrop-blur-md border-t-2 border-black p-4 z-40 flex justify-between items-center px-6"
        >
          <span className="font-mono text-xs font-bold uppercase">
             {links.find(l => l.href === location)?.label || "Portfolio"}
          </span>
          <span className="font-hand text-xs opacity-50">Tap menu to explore ⤴</span>
        </motion.div>
      )}
    </>
  );
}
