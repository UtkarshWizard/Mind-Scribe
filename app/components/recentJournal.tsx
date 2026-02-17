import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { CalendarIcon, FrownIcon, MehIcon, SmileIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { startProgress } from "./NavigationProgress";
import { Skeleton } from "./Skeleton";

interface JournalEntry {
  id: string;
  content: JSON;
  plainText: string;
  sentiment: {
    overallEmotion: string;
  };
  createdAt: string; // Date string
  updatedAt: string | null;
}

export function getPreview(text: string, words = 100) {
  return text.replace(/\s+/g, " ").trim().split(" ").slice(0, words).join(" ");
}

export function RecentJournalEntries() {
  const [Journals, setJournals] = useState<JournalEntry[]>([]);
  const [loading , setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchJournals = async () => {
      try {
        const response = await axios.get<{ journals: JournalEntry[] }>(
          "/api/journal?limit=5",
        );
        // console.log("response - " , response.data.journals);
        const recentJournals = response.data.journals;
        setJournals(recentJournals);
      } catch (error) {
        console.error("Error fetching journal for today:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJournals();
  }, []);

  // console.log(Journals);

  const moodIcon: Record<string, React.ReactNode> = {
    Happy: (
      <SmileIcon className="w-6 h-6 text-yellow-800 dark:text-yellow-300" />
    ),
    Neutral: <MehIcon className="w-6 h-6 text-black dark:text-gray-200" />,
    Sad: <FrownIcon className="w-6 h-6 text-red-600 dark:text-red-400" />,
  };

  const moodColor: Record<string, string> = {
    Happy: "bg-pastel-green/50 dark:bg-pastel-green/80",
    Neutral: "bg-pastel-yellow/40 dark:bg-pastel-yellow/80",
    Sad: "bg-pastel-pink/50 dark:bg-pastel-pink/80",
  };

  if (loading) {
    return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-24 w-full" />
    </div>
    )
  }

  return (
    <div>
      {Journals.length === 0 ? (
        <div className="text-center mb-4 md:mb-8">
          <p className="text-xl font-semibold text-black dark:text-white pb-2">
            &quot; Every day is a new chapter. &quot;
          </p>
          <p>
            Capture your thoughts and memories—begin with your first journal
            entry!
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {Journals.map((entry) => {
            const dateString = entry.createdAt.split("T")[0];

            return (
              <Link key={entry.id} onClick={() => startProgress()} href={`/journals/${entry.id}`}>
                <Card
                  className={`rounded-lg overflow-hidden transform transition-all duration-300 hover:scale-[1] hover:shadow-2xl dark:hover:shadow-gray-500 dark:hover:scale-[1.01] cursor-pointer ${moodColor[entry.sentiment.overallEmotion]}`}
                >
                  <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <Badge
                      variant="outline"
                      className="text-sm font-normal bg-white dark:bg-gray-800 transition-none"
                    >
                      <CalendarIcon className="w-3 h-3 mr-1" />
                      {new Date(dateString).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </Badge>

                    <span className="text-sm bg-muted p-2 rounded-full">
                      {moodIcon[entry.sentiment.overallEmotion]}
                    </span>
                  </div>
                  <p className="text-gray-700">
                    {getPreview(entry.plainText, 10)}
                  </p>
                </CardContent>
              </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
