"use client"

import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { TreesIcon as Lungs, SpaceIcon as Yoga, Music, Podcast, NotebookIcon as Lotus } from "lucide-react"
import "./exercise.css"
const exercises = [
  {
    id: "breathing",
    title: "Breathing",
    icon: Lungs,
    benefit:
      "Calms the nervous system, reduces stress, and improves focus — great for quick resets.",
    content:
      "Try box breathing: inhale 4, hold 4, exhale 4, hold 4. Repeat for 3–5 minutes with soft attention.",
    color: "from-blue-200 to-blue-400",
    video: "https://www.youtube.com/embed/LiUnFJ8P4gM",
  },
  {
    id: "meditation",
    title: "Meditation",
    icon: Lotus,
    benefit:
      "Builds attention and emotional resilience. Short daily sits stack into big improvements.",
    content:
      "Sit comfortably, soften focus on breath. When thoughts come, label and release — no judgment.",
    color: "from-purple-200 to-purple-400",
    video: "https://www.youtube.com/embed/inpok4MKVLM",
  },
  {
    id: "yoga",
    title: "Yoga",
    icon: Yoga,
    benefit: "Connects breath and movement, releases tension, and improves body awareness.",
    content: "Flow slowly through a few sun salutations, honor your range and breathe into each pose.",
    color: "from-green-200 to-green-400",
    video: "https://www.youtube.com/embed/v7AYKMP6rOE",
  },
  {
    id: "music",
    title: "Music",
    icon: Music,
    benefit: "Soothes the mind and helps regulate mood; use as a background reset.",
    content: "Pick calming instrumental or lo-fi beats. Close your eyes and listen for 5–10 minutes.",
    color: "from-yellow-200 to-amber-400",
    video: "https://www.youtube.com/embed/lTRiuFIWV54",
  },
  {
    id: "podcast",
    title: "Podcast",
    icon: Podcast,
    benefit: "Micro-lessons in mindfulness or mental health — good for thoughtful distraction.",
    content: "Choose a short mindfulness episode. Listen actively and take one actionable note.",
    color: "from-rose-200 to-rose-400",
    video: "https://www.youtube.com/embed/d7sUWwHugg8",
  },
]

export default function MindExercises() {
  return (
    <div className="min-h-screen pt-12 pb-20 px-6 md:px-12 dark:bg-gray-900 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <motion.header
          className="mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl sm:text-4xl font-extrabold dark:text-gray-100 text-gray-800 tracking-tight">
            Mind Exercises
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-sm sm:text-base dark:text-gray-300 text-gray-600">
            Small, calming practices to reset your mood and sharpen focus. Pick an exercise below and follow
            the short guided video.
          </p>
        </motion.header>

        {/* Desktop: Tabs */}
        <div className="hidden md:block">
          <Tabs defaultValue="breathing">
            <TabsList className="grid grid-cols-5 gap-3 mb-6 dark:bg-gray-200/10 p-2 rounded-xl h-full">
              {exercises.map((ex) => (
                <TabsTrigger
                  key={ex.id}
                  value={ex.id}
                  className="flex items-center gap-2 justify-center rounded-xl py-3 px-2 bg-gray-300/60 dark:bg-gray-600/60 border border-transparent hover:scale-[1.01] transition-transform dark:data-[state=active]:bg-gray-900 dark:data-[state=active]:text-white"
                >
                  <ex.icon className="h-4 w-4 dark:text-gray-200 text-gray-700" />
                  <span className="text-sm font-medium dark:text-gray-100 text-gray-800">{ex.title}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {exercises.map((ex) => (
              <TabsContent key={ex.id} value={ex.id}>
                <Card className="bg-transparent shadow-none border-0">
                  <CardContent className="p-0">
                    <div className="grid grid-cols-1 gap-6 items-start">
                      <motion.div
                        className={`rounded-2xl p-6 bg-gradient-to-b ${ex.color} text-gray-900 dark:text-gray-900/90 shadow-xl`}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <h2 className="text-2xl font-semibold mb-2">{ex.title}</h2>
                        <p className="text-sm mb-4 opacity-90">{ex.benefit}</p>
                        <div className="prose prose-sm text-gray-800 dark:prose-invert">
                          <p>{ex.content}</p>
                        </div>
                      </motion.div>

                      <div className="rounded-2xl overflow-hidden bg-white/70 dark:bg-gray-800/60 border border-transparent">
                        <div className="relative pb-[56.25%] h-0">
                          <iframe
                            className="absolute inset-0 w-full h-full"
                            src={ex.video}
                            title={`${ex.title} video`}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* Mobile: Accordion using details */}
        <div className="md:hidden space-y-4">
          {exercises.map((ex) => (
            <details
              key={ex.id}
              className="group rounded-2xl bg-white/60 dark:bg-gray-800/60 p-4 border border-transparent"
            >
              <summary className="flex items-center justify-between cursor-pointer list-none">
                <div className="flex items-center gap-3">
                  <ex.icon className="h-5 w-5 dark:text-gray-200 text-gray-700" />
                  <div>
                    <div className="text-sm font-medium dark:text-gray-100 text-gray-800">{ex.title}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{ex.benefit}</div>
                  </div>
                </div>
                <span className="text-xs text-gray-400 group-open:rotate-180 transition-transform">▾</span>
              </summary>
              <div className="mt-3 space-y-3">
                <p className="text-sm dark:text-gray-300 text-gray-700">{ex.content}</p>
                <div className="relative pb-[56.25%] h-0">
                  <iframe
                    className="absolute inset-0 w-full h-full rounded-lg"
                    src={ex.video}
                    title={`${ex.title} video`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              </div>
            </details>
          ))}
        </div>
      </div>
    </div>
  )
}

