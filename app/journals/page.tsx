"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { CirclePlus, PlusCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, SmileIcon, MehIcon, FrownIcon } from "lucide-react";
import axios from "axios";
import NavBar from "../components/NavBar-Dashboard";
import { useRouter } from "next/navigation";

type Emotion = "Happy" | "Neutral" | "Sad";

interface Journal {
  id: string;
  content: JSON;
  plainText: string;
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
  const [yearsList, setYearsList] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const fetchJournals = async () => {
      try {
        const response = await axios.get<{ journal: Journal[] }>(
          "/api/journal",
        );
        setJournals(response.data.journal);
      } catch (error) {
        console.error("Failed to fetch journals", error);
      }
    };

    fetchJournals();
  }, []);

  useEffect(() => {
    const fetchYears = async () => {
      const derived = Object.keys(groupJournalsByYear(journals))
        .map(Number)
        .sort((a, b) => b - a);
      setYearsList(derived);
      if (derived.length && selectedYear === null) setSelectedYear(derived[0]);
    };

    fetchYears();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [journals]);

  const groupJournalsByYear = (journals: Journal[]) => {
    return journals.reduce(
      (acc, journal) => {
        const year = new Date(journal.createdAt).getFullYear();
        if (!acc[year]) {
          acc[year] = [];
        }
        acc[year].push(journal);
        return acc;
      },
      {} as Record<number, Journal[]>,
    );
  };

  const groupedJournals = groupJournalsByYear(journals);
  const years = yearsList.length
    ? yearsList
    : Object.keys(groupedJournals)
        .map(Number)
        .sort((a, b) => b - a);

  const moodIcon = {
    Happy: (
      <SmileIcon className="w-6 h-6 text-yellow-800 dark:text-yellow-300" />
    ),
    Neutral: <MehIcon className="w-6 h-6 text-black dark:text-gray-200" />,
    Sad: <FrownIcon className="w-6 h-6 text-red-600 dark:text-red-400" />,
  };

  const moodColor = {
    Happy: "bg-pastel-green/50 dark:bg-pastel-green/80",
    Neutral: "bg-pastel-yellow/40 dark:bg-pastel-yellow/80",
    Sad: "bg-pastel-pink/50 dark:bg-pastel-pink/80",
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavBar />
      <div className="flex justify-center py-10 px-4">
        <div className="w-full max-w-4xl">
          <header className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              My Journals
            </h1>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <select
                  value={selectedYear ?? ""}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="px-3 py-2 rounded-md border bg-white dark:bg-gray-800 dark:border-gray-700 text-sm text-gray-800 dark:text-gray-100 cursor-pointer"
                >
                  {years.length === 0 && <option value="">All years</option>}
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>

                <input
                  aria-label="Search journals"
                  placeholder="Search journals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 min-w-0 px-3 py-2 rounded-md border bg-white dark:bg-gray-800 dark:border-gray-700 text-sm text-gray-800 dark:text-gray-100"
                />
              </div>

              <div className="ml-auto">
                <Button
                  onClick={() => router.push("/editor")}
                  className="inline-flex h-12 animate-shimmer items-center justify-center rounded-sm border border-slate-800 dark:border-slate-600 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-4 font-medium text-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
                >
                  <div className="flex justify-center items-center gap-4">
                    <CirclePlus className="text-orange-400 hover:text-orange-600 !h-4 !w-4" />
                    <div className="text-md">New Journal</div>
                  </div>  
                </Button>
              </div>
            </div>
          </header>

          <main className="space-y-4">
            {journals
              .filter((j) =>
                selectedYear
                  ? new Date(j.createdAt).getFullYear() === selectedYear
                  : true,
              )
              .filter((j) =>
                searchQuery
                  ? j.plainText
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase())
                  : true,
              )
              .sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime(),
              )
              .map((journal) => (
                <Card
                  key={journal.id}
                  className={`rounded-lg overflow-hidden transform transition-all duration-300 hover:scale-[1] hover:shadow-2xl dark:hover:shadow-gray-500 dark:hover:scale-[1.01] cursor-pointer ${moodColor[journal.sentiment.overallEmotion]}`}
                  onClick={() => router.push(`/journals/${journal.id}`)}
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <Badge
                        variant="outline"
                        className="text-sm font-normal bg-white dark:bg-gray-800 transition-none"
                      >
                        <CalendarIcon className="w-3 h-3 mr-1" />
                        {new Intl.DateTimeFormat("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          timeZone: "UTC",
                        }).format(new Date(journal.createdAt))}
                      </Badge>

                      <span className="text-sm bg-muted p-2 rounded-full">
                        {moodIcon[journal.sentiment.overallEmotion]}
                      </span>
                    </div>
                    <p className="text-gray-700">
                      {truncateContent(journal.plainText)}
                    </p>
                  </CardContent>
                </Card>
              ))}
          </main>
        </div>
      </div>
    </div>
  );
}
