import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface RecommendationType {
  recommendation: {
    quote: string;
    exercise: string;
  };
}

export function PersonalizedRecommendations({
  recommendation,
}: RecommendationType) {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-xl">Personalized Recommendations</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col justify-center gap-4">
        <motion.div
          className="bg-muted p-4 rounded-lg transition-shadow duration-300 ease-in-out hover:shadow-lg"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <p className="mb-2">{recommendation.quote || "Loading..."}</p>
        </motion.div>
        <motion.div
          className="bg-muted p-4 rounded-lg transition-shadow duration-300 ease-in-out hover:shadow-lg"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <p className="mb-2">{recommendation.exercise || "Loading..."}</p>
          <Button variant="link" className="p-0 text-blue-700">
            <a href={"/exercises"} target="_blank" rel="noopener noreferrer">
              Explore More
            </a>
          </Button>
        </motion.div>
      </CardContent>
    </Card>
  );
}
