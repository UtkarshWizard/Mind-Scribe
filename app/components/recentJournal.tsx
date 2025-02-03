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
        const response = await axios.get<{journal : JournalEntry[]}>("/api/journal");
        // console.log(response.data.journal);

        if (response.data.journal) {
          const sortedJournals = response.data.journal.sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
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
    <Card>
      <CardHeader className="">
        <CardTitle className="text-xl lg:text-3xl pb-8 flex justify-between gap-4">
          Recent Journal Entries
          <Button
            className="cursor-pointer"
            onClick={() => {
              router.push("/journals");
            }}
          >
            Show All Entries
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {Journals.length === 0 ? (
          <div className="text-center">
            <p className="text-xl font-semibold text-black pb-2">
              &quot; Every day is a new chapter. &quot;
            </p>
            <p>
              Capture your thoughts and memories—begin with your first journal
              entry!
            </p>
          </div>
        ) : (
          <ul className="space-y-4">
            {Journals.map((entry) => {
              const dateString = entry.createdAt.split("T")[0];

              return (
                <li key={entry.id} className="border-b pb-4 last:border-b-0">
                  <div className="flex justify-between items-start mb-4">
                    <span className="font-semibold">
                      {new Date(dateString).toLocaleDateString("en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                    </span>
                    <span className="text-sm bg-muted px-2 py-1 rounded">
                      {entry.sentiment.overallEmotion}
                    </span>
                  </div>
                  <p className="text-sm mb-2">
                    {entry.content.substring(0, 100)}...
                  </p>
                  <Button variant="link" className="p-0 text-blue-700" onClick={() => (router.push(`/journals/${entry.id}`))}>
                    View Details
                  </Button>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
