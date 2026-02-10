"use client"

import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { TreesIcon as Lungs, SpaceIcon as Yoga, Music, Podcast, NotebookIcon as Lotus } from "lucide-react"
import "./exercise.css"

const exercises = [
  {
    title: "Breathing",
    icon: Lungs,
    content: "Practice deep breathing for 5 minutes. Inhale for 4 counts, hold for 4, exhale for 4.",
    color: "bg-blue-500",
  },
  {
    title: "Meditation",
    icon: Lotus,
    content: "Sit comfortably and focus on your breath. When your mind wanders, gently bring it back.",
    color: "bg-purple-500",
  },
  {
    title: "Yoga",
    icon: Yoga,
    content: "Try a simple sun salutation sequence. Move through the poses slowly and mindfully.",
    color: "bg-green-500",
  },
  {
    title: "Music",
    icon: Music,
    content: "Listen to calming instrumental music. Close your eyes and let the melody wash over you.",
    color: "bg-yellow-500",
  },
  {
    title: "Podcast",
    icon: Podcast,
    content: "Listen to a mindfulness podcast. Focus on the speaker's words and try to stay present.",
    color: "bg-red-500",
  },
]

export default function MindExercises() {
  return (
    <div className="min-h-screen dark:bg-gray-900 bg-gray-100 p-8">
      <motion.h1
        className="text-4xl font-bold text-center mb-8 dark:text-gray-200 text-gray-700 float"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Mind Exercises
      </motion.h1>
      <Tabs defaultValue="breathing" className="w-full max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-5">
          {exercises.map((exercise) => (
            <TabsTrigger key={exercise.title} value={exercise.title.toLowerCase()} className="tab-trigger">
              <exercise.icon className="mr-2 h-4 w-4" />
              {exercise.title}
            </TabsTrigger>
          ))}
        </TabsList>
        {exercises.map((exercise) => (
          <TabsContent key={exercise.title} value={exercise.title.toLowerCase()}>
            <Card>
              <CardContent className="pt-6">
                <motion.div
                  className={`p-6 rounded-lg shadow-lg ${exercise.color} text-white exercise-card`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-2xl font-bold mb-4">{exercise.title} Exercise</h2>
                  <p>{exercise.content}</p>
                </motion.div>
                <div className="">
                  <iframe width="560" height="315" src="https://www.youtube.com/embed/LiUnFJ8P4gM?si=XyfqUs8-D6P4TsGI" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

