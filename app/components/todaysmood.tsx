"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Smile, Meh, Frown } from "lucide-react"

const moods = [
  { emoji: <Smile className="w-6 h-6" />, label: "Happy", color: "bg-green-200" },
  { emoji: <Meh className="w-6 h-6" />, label: "Neutral", color: "bg-yellow-200" },
  { emoji: <Frown className="w-6 h-6" />, label: "Sad", color: "bg-blue-200" },
]

export function MoodTracker() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null)

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card>
        <CardHeader className="bg-secondary text-secondary-foreground">
          <CardTitle className="text-xl">Today's Mood</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex justify-around">
            {moods.map((mood) => (
              <motion.div key={mood.label} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant={selectedMood === mood.label ? "default" : "outline"}
                  className={`flex flex-col items-center p-4 h-full min-w-20 md:min-w-24 ${selectedMood === mood.label ? mood.color : ""}`}
                  onClick={() => setSelectedMood(mood.label)}
                >
                  {mood.emoji}
                  <span className="mt-2">{mood.label}</span>
                </Button>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

