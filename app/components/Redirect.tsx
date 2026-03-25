'use client'

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Redirect () {
    const { status } = useSession();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        setMounted(true);
        const messages = [
            "Synchronizing your thoughts...",
            "Polishing your journals...",
            "Gathering your reflections...",
            "Welcome back to MindScribe..."
        ];
        setMessage(messages[Math.floor(Math.random() * messages.length)]);
    }, []);

    useEffect(() => {
        if (status === "authenticated") {
            router.push("/dashboard")
        }
    }, [status, router]);
    
    // Show premium loader if we're checking auth or if we're authenticated and about to redirect
    if ((status === "loading" || status === "authenticated") && mounted) {
        return (
            <AnimatePresence>
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.5 } }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-neutral-950"
                >
                    {/* Background Decorative Elements */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-600/10 rounded-full blur-[120px] animate-pulse" />
                        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse [animation-delay:1s]" />
                    </div>

                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", damping: 20, stiffness: 100 }}
                        className="flex flex-col items-center gap-8 p-10 rounded-[2.5rem] bg-neutral-900/40 backdrop-blur-3xl border border-white/10 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] relative z-10"
                    >
                        <div className="relative">
                            {/* Inner Spin */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                className="w-20 h-20 rounded-full border-2 border-orange-500/10 border-t-orange-500"
                            />
                            {/* Outer Spin (Reverse) */}
                            <motion.div
                                animate={{ rotate: -360 }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-[-4px] rounded-full border border-blue-500/5 border-b-blue-500/20"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <motion.div
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
                                </motion.div>
                            </div>
                        </div>
                        
                        <div className="space-y-3 text-center">
                            <motion.h2 
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="text-2xl font-medium tracking-tight text-white"
                            >
                                Preparing your space
                            </motion.h2>
                            <motion.p 
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-neutral-500 text-sm max-w-[220px] leading-relaxed italic"
                            >
                                &quot;{message}&quot;
                            </motion.p>
                        </div>
                        
                        <div className="flex gap-1.5 pt-2">
                            {[0, 1, 2].map((i) => (
                                <motion.span 
                                    key={i}
                                    animate={{ 
                                        scale: [1, 1.5, 1],
                                        opacity: [0.3, 1, 0.3]
                                    }}
                                    transition={{ 
                                        duration: 1, 
                                        repeat: Infinity, 
                                        delay: i * 0.2 
                                    }}
                                    className="w-1.5 h-1.5 rounded-full bg-orange-500" 
                                />
                            ))}
                        </div>
                    </motion.div>
                </motion.div>
            </AnimatePresence>
        );
    }

    return null;
}
