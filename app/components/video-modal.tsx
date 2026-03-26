"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: string;
}

export default function VideoModal({ isOpen, onClose, videoId }: VideoModalProps) {
  const [isLoading, setIsLoading] = useState(true);

  // Reset loading state when modal closes/opens
  useEffect(() => {
    if (!isOpen) {
      setIsLoading(true);
    }
  }, [isOpen]);

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop with extreme blur and dark tint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-md cursor-pointer"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-5xl aspect-video bg-neutral-900 rounded-[2rem] overflow-hidden shadow-[0_0_50px_-12px_rgba(249,115,22,0.3)] border border-white/10"
          >
            {/* Close Button - Glassmorphic */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="absolute top-6 right-6 z-20 p-3 rounded-full bg-black/50 text-white/70 hover:text-white hover:bg-black/70 transition-all border border-white/10 backdrop-blur-xl"
            >
              <X className="w-5 h-5" />
            </motion.button>

            {/* Video Wrapper */}
            <div className="w-full h-full relative bg-black">
              {/* Preloaded Thumbnail / Loading State */}
              <AnimatePresence>
                {isLoading && (
                  <motion.div 
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-10 flex items-center justify-center"
                  >
                    <Image
                      src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                      alt="Video thumbnail"
                      fill
                      className="object-cover opacity-40 blur-sm"
                      priority
                    />
                    <div className="relative z-20">
                      <div className="w-12 h-12 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1&iv_load_policy=3&showinfo=0&controls=1`}
                title="MindScribe Demo Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                onLoad={() => setIsLoading(false)}
                className="w-full h-full border-none relative z-0"
              />
              
              {/* Subtle overlay gradient to match the theme */}
              {!isLoading && <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/20 to-transparent z-10" />}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
