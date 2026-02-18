import { Navigation, MobileNav } from "./Navigation";
import { PageTransition } from "./PageTransition";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-yellow-300 selection:text-black overflow-x-hidden">
      {/* Grain Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-20 mix-blend-multiply z-[100] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      
      <Navigation />
      
      <main className="md:pl-64 min-h-screen pb-20 md:pb-0">
        <div className="max-w-7xl mx-auto p-6 md:p-12 lg:p-20">
           <PageTransition>
             {children}
           </PageTransition>
        </div>
      </main>
      
      <MobileNav />
    </div>
  );
}
