import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

// This would typically be fetched from your backend based on user's mood and preferences
const mockRecommendations = [
  { type: "activity", content: "You're feeling down. How about journaling something you're grateful for?" },
  {
    type: "quote",
    content: "Happiness can be found even in the darkest of times, if one only remembers to turn on the light.",
  },
  { type: "resource", content: "5-Minute Meditation for Stress Relief", link: "#" },
]

export function PersonalizedRecommendations() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Personalized Recommendations</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {mockRecommendations.map((rec, index) => (
            <motion.li
              key={index}
              className="bg-muted p-4 rounded-lg transition-shadow duration-300 ease-in-out hover:shadow-lg"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <p className="mb-2">{rec.content}</p>
              {rec.type === "resource" && (
                <Button variant="link" className="p-0">
                  <a href={rec.link} target="_blank" rel="noopener noreferrer">
                    Check it out
                  </a>
                </Button>
              )}
            </motion.li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

