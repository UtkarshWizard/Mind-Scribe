'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { motion } from 'framer-motion'

const testimonials = [
  {
    name: 'Sarah L.',
    avatar: 'SL',
    text: 'Mind Scribe has been a game-changer for my mental health. The AI insights are incredibly helpful!',
    gradient: 'from-blue-800 to-purple-900'
  },
  {
    name: 'Michael R.',
    avatar: 'MR',
    text: 'I love how the app gamifies the journaling experience. It keeps me motivated to write every day.',
    gradient: 'from-purple-800 to-indigo-900'
  },
  {
    name: 'Emily T.',
    avatar: 'ET',
    text: 'The mood tracking feature has helped me identify triggers and improve my overall well-being.',
    gradient: 'from-indigo-800 to-blue-900'
  }
]

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-20 px-6 md:px-10 bg-gray-900 overflow-hidden">
      <motion.h2 
        className="text-3xl font-bold text-center mb-12 text-white"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        What Our Users Say
      </motion.h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className={`h-full hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br ${testimonial.gradient}`}>
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={`${testimonial.avatar}`} />
                    <AvatarFallback>{testimonial.avatar}</AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-white">{testimonial.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-200">{testimonial.text}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

