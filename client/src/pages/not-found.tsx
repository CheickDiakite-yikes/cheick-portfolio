import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
      <h1 className="font-serif text-9xl mb-4">404</h1>
      <div className="bg-yellow-200 p-8 rotate-3 shadow-brutal border-2 border-black max-w-md">
        <h2 className="font-mono text-xl font-bold mb-4 uppercase">Page Missing</h2>
        <p className="font-hand text-xl mb-6">
          "I looked everywhere, but I couldn't find this page. Maybe it was torn out?"
        </p>
        <Link href="/" className="inline-block border-2 border-black px-4 py-2 hover:bg-black hover:text-white transition-colors font-mono uppercase text-sm font-bold">
            Return Home
        </Link>
      </div>
    </div>
  );
}
