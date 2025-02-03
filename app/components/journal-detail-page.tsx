"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { JournalContent } from "./journal-content";
import { JournalActions } from "./journal-actions";
import { AIFriendlyResponse } from "./ai-response";
import { SentimentInsights } from "./sentimentInsights";
import { PersonalizedRecommendations } from "./personalizedRecommendations";
import { useEffect, useState } from "react";
import axios from "axios";

type Emotion = "Happy" | "Neutral" | "Sad";

interface Journal {
  id: string;
  content: string;
  sentiment: {
    emotions: {
      Happy: number;
      Neutral: number;
      Sad: number;
    };
    overallEmotion: Emotion;
    friends_response: string;
    personalized_recommendation: {
      quote: string;
      exercise: string;
    };
  };
  createdAt: string;
  updatedAt: string | null;
}

export function JournalDetailPage({ id }: { id: string }) {
  const [journal, setJournal] = useState<Journal | null>(null); // Correct state type

  useEffect(() => {
    const fetchJournal = async () => {
      try {
        const response = await axios.get(`/api/journal/${id}`);
        console.log("response:" ,response)
        setJournal(response.data);
      } catch (err) {
        console.error("Error fetching journal for today:", err);
      }
    };

    fetchJournal();
  }, [id]);

  console.log(journal)

  // Early return if journal data is not yet loaded
  if (!journal) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold text-black pb-2">
                  {new Intl.DateTimeFormat("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    timeZone: "UTC",
                  }).format(new Date(journal.createdAt))}
                </h2>
                {journal.updatedAt && (
                  <p className="text-sm text-muted-foreground">
                    <span className="font-bold">Updated: </span>{new Intl.DateTimeFormat("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    timeZone: "UTC",
                  }).format(new Date(journal.createdAt))}
                  </p>
                )}
              </div>
              <JournalActions id={id} />
            </div>
            <JournalContent content={journal.content} />
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <AIFriendlyResponse journalContent={journal.sentiment.friends_response} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <SentimentInsights emotions={journal.sentiment.emotions} overallEmotion={journal.sentiment.overallEmotion} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <PersonalizedRecommendations recommendation={journal.sentiment.personalized_recommendation} />
      </motion.div>
    </div>
  );
}
