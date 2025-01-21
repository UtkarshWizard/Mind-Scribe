import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useState } from 'react'

// This would typically be fetched from your backend
const mockSentimentData = {
  overall: 'Neutral',
  categories: [
    { name: 'Happy', percentage: 30 },
    { name: 'Neutral', percentage: 50 },
    { name: 'Sad', percentage: 20 },
  ],
}

const [ Sentiment , setSentiment ] = useState({
  overall: "",
  categories: [
    { name: 'Happy', percentage: 0 },
    { name: 'Neutral', percentage: 0 },
    { name: 'Sad', percentage: 0 },
  ],
})

export function SentimentInsights() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-xl'>Sentiment Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-lg mb-4">Your mood today is: <strong>{mockSentimentData.overall}</strong></p>
        <div className="space-y-4">
          {mockSentimentData.categories.map((category) => (
            <div key={category.name}>
              <div className="flex justify-between mb-1">
                <span>{category.name}</span>
                <span>{category.percentage}%</span>
              </div>
              <Progress value={category.percentage} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

