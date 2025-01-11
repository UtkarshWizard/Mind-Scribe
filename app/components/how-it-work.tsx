'use client'

import { CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'

const steps = [
  'Sign up for a free account',
  'Set your mental health goals',
  'Start your daily journaling practice',
  'Engage with mindfulness exercises',
  'Track your mood and progress',
  'Receive personalized insights and recommendations'
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0 }
}

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 px-6 md:px-10 bg-gray-800">
      <motion.h2 
        className="text-3xl font-bold text-center mb-12 text-white"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        How It Works
      </motion.h2>
      <motion.div 
        className="max-w-3xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <ol className="space-y-6">
          {steps.map((step, index) => (
            <motion.li 
              key={index} 
              className="flex items-center space-x-4"
              variants={itemVariants}
            >
              <CheckCircle className="w-6 h-6 text-purple-400 flex-shrink-0" />
              <span className="text-lg text-gray-300">{step}</span>
            </motion.li>
          ))}
        </ol>
      </motion.div>
    </section>
  )
}

