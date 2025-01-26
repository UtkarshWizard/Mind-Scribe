"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, SmileIcon, MehIcon, FrownIcon } from "lucide-react";
import axios from "axios";
import { YearNavigation } from "../components/yearNavigation";
import NavBar from "../components/NavBar-Dashboard";
import { useRouter } from "next/navigation";

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
  createdAt: string;
  updatedAt: string | null;
}

export default function JournalsPage() {
  const [journals, setJournals] = useState<Journal[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  useEffect(() => {
    const fetchJournals = async () => {
      try {
        const response = await axios.get<{ journal: Journal[] }>(
          "/api/journal"
        );
        setJournals(response.data.journal);
      } catch (error) {
        console.error("Failed to fetch journals", error);
      }
    };

    fetchJournals();
  }, []);

  const groupJournalsByYear = (journals: Journal[]) => {
    return journals.reduce((acc, journal) => {
      const year = new Date(journal.createdAt).getFullYear();
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(journal);
      return acc;
    }, {} as Record<number, Journal[]>);
  };

  const groupedJournals = groupJournalsByYear(journals);
  const years = Object.keys(groupedJournals)
    .map(Number)
    .sort((a, b) => b - a);

  useEffect(() => {
    if (years.length > 0 && selectedYear === null) {
      setSelectedYear(years[0]); // Default to the most recent year
    }
  }, [years]);

  const moodIcon = {
    Happy: <SmileIcon className="w-4 h-4 text-yellow-800" />,
    Neutral: <MehIcon className="w-4 h-4 text-black" />,
    Sad: <FrownIcon className="w-4 h-4 text-red-600" />,
  };

  const moodColor = {
    Happy: "bg-pastel-green/20",
    Neutral: "bg-pastel-yellow/20",
    Sad: "bg-pastel-pink/20",
  };

  const router = useRouter();

  const truncateContent = (content: string) => {
    const words = content.split(" ");
    if (words.length > 20) {
      return words.slice(0, 20).join(" ") + "...";
    }
    return content;
  };
  
  return (
    
    <div>
      <NavBar />
      <div className="flex h-screen bg-pastel-yellow/20">
        <aside className="w-64 bg-white p-6 border-r border-pastel-blue/30">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">My Journals</h1>
          <YearNavigation
            years={years}
            selectedYear={selectedYear || years[0]}
            onYearSelect={setSelectedYear}
          />
          <Button
            asChild
            className="w-full mt-6 bg-pastel-purple hover:bg-pastel-purple/90 text-gray-800"
          >
            <Link href="/dashboard">
              <PlusCircle className="mr-2 h-5 w-5" /> New Entry
            </Link>
          </Button>
        </aside>
        <main className="flex-1 p-6 overflow-hidden">
          <ScrollArea className="h-full pr-4">
            <div className="space-y-6">
              {groupedJournals[selectedYear!]
                ?.sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                )
                .map((journal) => (
                  <Card
                    key={journal.id}
                    className={`hover:shadow-lg hover:cursor-pointer transition-shadow duration-300 ${
                      moodColor[journal.sentiment.overallEmotion]
                    }`}
                    onClick={() => router.push(`/journals/${journal.id}`)}
                    
                  >
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <Badge
                          variant="outline"
                          className="text-sm font-normal bg-white"
                        >
                          <CalendarIcon className="w-3 h-3 mr-1" />
                          {new Intl.DateTimeFormat("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            timeZone: "UTC",
                          }).format(new Date(journal.createdAt))}
                        </Badge>

                        <span className="text-sm bg-muted px-2 py-1 rounded">
                          {moodIcon[journal.sentiment.overallEmotion]}
                        </span>
                      </div>
                      <p className="text-gray-700">{truncateContent(journal.content)}</p>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </ScrollArea>
        </main>
      </div>
    </div>
  );
}
