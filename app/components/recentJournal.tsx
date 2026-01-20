import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

interface JournalEntry {
  id: string;
  content: string;
  sentiment: {
    overallEmotion: string;
  };
  createdAt: string; // Date string
  updatedAt: string | null;
}

export function RecentJournalEntries() {
  const router = useRouter();
  const [Journals, setJournals] = useState<JournalEntry[]>([]);

  useEffect(() => {
    const fetchJournals = async () => {
      try {
        const response = await axios.get<{ journal: JournalEntry[] }>(
          "/api/journal",
        );
        // console.log(response.data.journal);

        if (response.data.journal) {
          const sortedJournals = response.data.journal.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          );
          // console.log(sortedJournals)
          const recentJournals = sortedJournals.slice(0, 5);
          setJournals(recentJournals);
        }
      } catch (error) {
        console.error("Error fetching journal for today:", error);
      }
    };

    fetchJournals();
  }, []);

  // console.log(Journals);

  return (
    <div>
      {Journals.length === 0 ? (
        <div className="text-center mb-4 md:mb-8">
          <p className="text-xl font-semibold text-black pb-2">
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
              <div key={entry.id} className="bg-gray-800 text-white rounded-md p-4 flex flex-col gap-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex flex-col gap-2">
                    <span className="text-lg">
                      {new Date(dateString).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <span className="text-lg">
                    {entry.sentiment.overallEmotion}
                  </span>
                </div>
                <span className="text-lg">
                  {entry.content.substring(0, 100)}...
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
