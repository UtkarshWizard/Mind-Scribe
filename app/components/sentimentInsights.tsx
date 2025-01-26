import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

type Emotion = "Happy" | "Neutral" | "Sad";

interface Sentiment {
  emotions: {
    Happy: number;
    Neutral: number;
    Sad: number;
  };
  overallEmotion: Emotion;
}

interface SentimentInsightsProps {
  emotions: Sentiment['emotions'];
  overallEmotion: Emotion;
}

export function SentimentInsights({ emotions , overallEmotion } : SentimentInsightsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Sentiment Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-lg mb-4">
          Your mood was: <strong>{overallEmotion}</strong>
        </p>
        <div className="space-y-4">
          {Object.entries(emotions).map(([category, percentage])  => (
            <div key={category}>
              <div className="flex justify-between mb-1">
                <span>{category}</span>
                <span>{percentage}%</span>
              </div>
              <Progress value={percentage} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
