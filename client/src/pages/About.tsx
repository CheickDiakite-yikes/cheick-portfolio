import { motion } from "framer-motion";

export default function About() {
  return (
    <div className="max-w-3xl">
      <motion.h1 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="font-serif text-5xl md:text-7xl mb-12"
      >
        About Me.
      </motion.h1>

      <div className="prose prose-lg font-mono">
        <p className="text-xl leading-relaxed mb-8">
          I am a multidisciplinary designer and developer based in San Francisco. 
          I believe in the power of <span className="bg-yellow-200 px-1">honest interfaces</span> and 
          tactile digital experiences.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 my-12">
          <div>
            <h3 className="font-serif text-2xl border-b-2 border-black pb-2 mb-4">Background</h3>
            <ul className="list-disc list-inside space-y-2 text-sm opacity-80">
              <li>Senior Product Designer @ Tech Corp</li>
              <li>Frontend Engineer @ Startup Inc</li>
              <li>Freelance Art Director</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-serif text-2xl border-b-2 border-black pb-2 mb-4">Services</h3>
            <ul className="list-disc list-inside space-y-2 text-sm opacity-80">
              <li>UI/UX Design</li>
              <li>Frontend Development</li>
              <li>Brand Identity</li>
              <li>Motion Graphics</li>
            </ul>
          </div>
        </div>

        <p className="text-lg">
          When I'm not coding, I'm likely exploring architecture, shooting film photography, 
          or collecting vintage design books.
        </p>
      </div>
      
      <div className="mt-20 p-8 border-4 border-black bg-stone-100 relative">
        <div className="absolute -top-4 -left-4 bg-black text-white px-4 py-1 font-mono text-xs">
          NOTE TO SELF
        </div>
        <p className="font-hand text-2xl rotate-1 text-center">
          "Simplicity is the ultimate sophistication."
        </p>
      </div>
    </div>
  );
}
