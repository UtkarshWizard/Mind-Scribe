"use client";
import { Brain, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { name: "Features", href: "/#features" },
    { name: "How it works", href: "/#demo" }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center py-6 px-4">
      <div className="bg-neutral-900/60 backdrop-blur-xl border border-white/5 rounded-2xl md:rounded-full px-6 py-3 flex items-center justify-between w-full max-w-5xl shadow-2xl shadow-black/50 relative">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 relative z-10">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
            <Brain className="text-white w-5 h-5" />
          </div>
          <span className="text-white font-medium text-lg tracking-tight">
            Mind<span className="text-orange-500">Scribe</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8 text-neutral-400 text-sm font-medium">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="hover:text-white transition-colors relative group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-orange-500 transition-all group-hover:w-full" />
            </a>
          ))}
        </div>

        {/* Auth Actions (Desktop) */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/auth/signIn"
            className="text-neutral-400 hover:text-white text-sm font-medium transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/auth/signUp"
            className="bg-white/10 hover:bg-white/20 text-white text-sm font-medium px-5 py-2 rounded-full transition-all border border-white/5 hover:border-white/10"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={toggleMenu}
          className="md:hidden p-2 text-neutral-400 hover:text-white transition-colors relative z-10"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="absolute top-full left-0 right-0 bg-neutral-900/95 backdrop-blur-2xl border-t border-white/5 md:hidden overflow-hidden flex flex-col p-6 gap-6"
            >
              <div className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="text-neutral-400 hover:text-white text-lg font-medium transition-colors"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
              <hr className="border-white/5" />
              <div className="flex flex-col gap-4">
                <Link
                  href="/auth/signIn"
                  onClick={() => setIsOpen(false)}
                  className="text-neutral-400 hover:text-white text-lg font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signUp"
                  onClick={() => setIsOpen(false)}
                  className="bg-orange-600 hover:bg-orange-500 text-white text-center font-medium py-3 rounded-xl transition-all shadow-lg shadow-orange-900/20"
                >
                  Get Started Free
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}

