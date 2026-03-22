"use client";
import { Brain } from "lucide-react";

export default function Header() {
  // const session = useSession();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center py-6 px-4">
      <div className="bg-neutral-900/60 backdrop-blur-xl border border-white/5 rounded-full px-6 py-3 flex items-center justify-between w-full max-w-5xl shadow-2xl shadow-black/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
            <Brain className="text-white w-5 h-5" />
          </div>
          <span className="text-white font-medium text-lg tracking-tight">
            Mind<span className="text-orange-500">Scribe</span>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-neutral-400 text-sm font-medium">
          <a href="#features" className="hover:text-white transition-colors">
            Features
          </a>
          <a href="#demo" className="hover:text-white transition-colors">
            How it works
          </a>
          <a href="#pricing" className="hover:text-white transition-colors">
            Pricing
          </a>
        </div>
        <button className="bg-white/10 hover:bg-white/20 text-white text-sm font-medium px-5 py-2 rounded-full transition-all border border-white/5 hover:border-white/10">
          Sign In
        </button>
      </div>
    </nav>
  );
}
