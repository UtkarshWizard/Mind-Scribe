'use client'

import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { signIn } from 'next-auth/react'

const words = ["daily reflection", "mood tracking", "mindfulness", "personal growth"]

export default function Hero() {
  const [currentWord, setCurrentWord] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-20 px-6 md:px-24 flex flex-col md:flex-row items-center justify-between overflow-hidden">
      <motion.div 
        className="md:w-1/2 mb-10 md:mb-0"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1 
          className="text-4xl md:text-5xl font-bold mb-6 text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          Unlock Your Mind with Mind Scribe
        </motion.h1>
        <motion.p 
          className="text-xl mb-8 text-blue-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          Your interactive mental health journal for{' '}
          <span className="relative inline-block w-44 h-8 align-top">
            <AnimatePresence mode="wait">
              <motion.span
                key={currentWord}
                className="absolute left-0 right-0 text-purple-300"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                {words[currentWord]}
              </motion.span>
            </AnimatePresence>
          </span>
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <Button 
            onClick={() => signIn()}
            size="lg" 
            className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600 transition-all duration-300"
          >
            Start Your Journey
          </Button>
        </motion.div>
      </motion.div>
      <motion.div 
        className="md:w-1/3"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <motion.div
          animate={{ 
            rotateX: [0, 10, 0, -10, 0],
            rotateY: [10, 0, -10, 0, 10],
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 5,
            ease: "easeInOut"
          }}
        >
          <Image 
            src="/images/heroimg.webp" 
            alt="Mind Scribe App Interface" 
            width={400} 
            height={400} 
            className="rounded-lg shadow-2xl"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}

