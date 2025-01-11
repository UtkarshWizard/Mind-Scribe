'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Brain, Sparkles, Trophy } from 'lucide-react'
import { motion } from 'framer-motion'

const features = [
  {
    title: 'AI-Powered Insights',
    description: 'Gain deep understanding of your thoughts and emotions with our advanced AI analysis.',
    icon: Brain,
    gradient: 'from-blue-700 to-blue-900'
  },
  {
    title: 'Daily Journaling',
    description: 'Express yourself freely in a safe, private space designed for reflection and growth.',
    icon: BookOpen,
    gradient: 'from-purple-700 to-purple-900'
  },
  {
    title: 'Mood Tracking',
    description: 'Visualize your emotional journey and identify patterns to improve your mental well-being.',
    icon: Sparkles,
    gradient: 'from-indigo-700 to-indigo-900'
  },
  {
    title: 'Gamified Experience',
    description: 'Stay motivated with rewards, challenges, and progress tracking as you build healthy habits.',
    icon: Trophy,
    gradient: 'from-violet-700 to-violet-900'
  }
]

export default function Features() {
  return (
    <section id="features" className="py-20 px-6 md:px-10 bg-gray-900">
      <motion.h2 
        className="text-3xl font-bold text-center mb-12 text-white"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Key Features
      </motion.h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="h-full hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 bg-gray-800 border-gray-700">
              <CardHeader className={`bg-gradient-to-r ${feature.gradient} text-white rounded-t-lg`}>
                <feature.icon className="w-10 h-10 mb-4" />
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 pt-8">{feature.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

