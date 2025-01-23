import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, SmileIcon, MehIcon, FrownIcon } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { NextResponse } from "next/server";

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
  };
  createdAt: string; // Date string
  updatedAt: string | null;
}

export function Journals() {
  const [JournalsAll, setJournalsAll] = useState<Journal[]>([]);

  useEffect(() => {
    const fetchJournals = async () => {
      try {
        const response = await axios.get<{journal : Journal[]}>("/api/journal");
        setJournalsAll(response.data.journal);
      } catch {
        return NextResponse.json({
            message : "Failed to fetch the journals"
        })
      }
    };

    fetchJournals()
  }, []);

  const moodIcon = {
    Happy: <SmileIcon className="w-4 h-4 text-pastel-green" />,
    Neutral: <MehIcon className="w-4 h-4 text-pastel-yellow" />,
    Sad: <FrownIcon className="w-4 h-4 text-pastel-pink" />,
  };

  const moodColor = {
    Happy: "bg-pastel-green/20",
    Neutral: "bg-pastel-yellow/20",
    Sad: "bg-pastel-pink/20",
  };

  return (
    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {JournalsAll.map((journal) => (
        <Card
          key={journal.id}
          className={`hover:shadow-lg transition-shadow duration-300 ${moodColor[journal.sentiment.overallEmotion]}`}
        >
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <Badge variant="outline" className="text-sm font-normal bg-white">
                <CalendarIcon className="w-3 h-3 mr-1" />
                {new Date(journal.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Badge>
              {moodIcon[journal.sentiment.overallEmotion]}
            </div>
            <p className="text-gray-700">{journal.content}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
