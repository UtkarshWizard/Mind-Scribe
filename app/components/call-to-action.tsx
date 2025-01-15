'use client'

import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function CallToAction() {
  const router = useRouter()
  return (
    <section className="py-20 px-6 md:px-10 bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 text-white text-center overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h2 
          className="text-3xl font-bold mb-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          Start Your Mental Health Journey Today
        </motion.h2>
        <motion.p 
          className="text-xl mb-8 max-w-2xl mx-auto text-blue-200"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          Join thousands of users who have improved their well-being with Mind Scribe. Your path to better mental health starts here.
        </motion.p>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <Button
            onClick={() =>  router.push('/auth/signup')} 
            size="lg" 
            className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600 transition-all duration-300"
          >
            Sign Up for Free
          </Button>
        </motion.div>
      </motion.div>
    </section>
  )
}