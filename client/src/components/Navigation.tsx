import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/resume", label: "Resume" },
  { href: "/blog", label: "Blog" },
  { href: "/guestbook", label: "Guestbook" },
  { href: "/contact", label: "Contact" },
  { href: "/admin", label: "Admin" },
];

export function Navigation() {
  const [location] = useLocation();

  return (
    <nav className="fixed left-0 top-0 h-screen w-64 bg-stone-100 border-r-4 border-black hidden md:flex flex-col p-8 z-50">
      <div className="mb-12">
        <h1 className="font-serif text-4xl font-bold italic tracking-tighter">
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
                  />
                )}
                <span
                  className={cn(
                    "font-mono text-lg transition-all duration-300 group-hover:pl-2",
                    isActive ? "font-bold underline decoration-2 underline-offset-4" : "opacity-60 hover:opacity-100"
                  )}
                >
                  {link.label}
                </span>
              </a>
            </Link>
          );
        })}
      </div>

      <div className="mt-auto">
        <div className="w-full h-[1px] bg-black/20 mb-4" />
        <p className="font-hand text-sm rotate-[-2deg]">
          "Make it nice!"
        </p>
      </div>
    </nav>
  );
}

export function MobileNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full bg-stone-100 border-t-2 border-black p-4 z-50 overflow-x-auto">
      <div className="flex gap-6 min-w-max px-4">
        {links.map((link) => (
          <Link key={link.href} href={link.href}>
             <a className="font-mono text-sm font-bold uppercase tracking-wider">
               {link.label}
             </a>
          </Link>
        ))}
      </div>
    </nav>
  );
}
