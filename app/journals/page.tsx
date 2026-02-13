"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CirclePlus, PlusCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, SmileIcon, MehIcon, FrownIcon } from "lucide-react";
import axios from "axios";
import NavBar from "../components/NavBar-Dashboard";
import { startProgress } from "../components/NavigationProgress";

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
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const limit = 20;
  const [sortOrder, setSortOrder] = useState<string>("latest");
  const [moodFilter, setMoodFilter] = useState<string>("");

  useEffect(() => {
    const fetchJournals = async () => {
      try {
        const params: Record<string, string> = {
          page: String(page),
          limit: String(limit),
          sort: sortOrder,
        };
        if (moodFilter) params.mood = moodFilter;
        if (selectedYear) params.year = String(selectedYear);

        const query = new URLSearchParams(params).toString();
        const response = await axios.get(`/api/journal?${query}`);
        setJournals(response.data.journals || response.data.journal || []);
        setTotal(response.data.total || 0);
      } catch (error) {
        console.error("Failed to fetch journals", error);
      }
    };

    fetchJournals();
  }, [page, sortOrder, moodFilter, selectedYear]);

  // fetch years (use a large limit to derive available years)
  useEffect(() => {
    const fetchYears = async () => {
      try {
        const resp = await axios.get(`/api/journal?limit=10000&sort=latest`);
        const all = resp.data.journals || resp.data.journal || [];
        const derived = Object.keys(groupJournalsByYear(all))
          .map(Number)
          .sort((a, b) => b - a);
        setYearsList(derived);
        if (derived.length && selectedYear === null)
          setSelectedYear(derived[0]);
      } catch (err) {
        console.error("Failed to fetch years", err);
      }
    };

    fetchYears();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

            <div className="flex flex-col md:flex-row md:items-center gap-3 sm:gap-4">
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3 w-full m-auto">
                  <select
                    value={selectedYear ?? ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSelectedYear(val ? Number(val) : null);
                      setPage(1);
                    }}
                    className="px-3 py-2 rounded-md border bg-white dark:bg-gray-800 dark:border-gray-700 text-sm text-gray-800 dark:text-gray-100 cursor-pointer"
                  >
                    {years.length === 0 && <option value="">All years</option>}
                    {years.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>

                  <select
                    value={sortOrder}
                    onChange={(e) => {
                      setSortOrder(e.target.value);
                      setPage(1);
                    }}
                    className="px-3 py-2 rounded-md border bg-white dark:bg-gray-800 dark:border-gray-700 text-sm text-gray-800 dark:text-gray-100 cursor-pointer ml-2"
                  >
                    <option value="latest">Latest</option>
                    <option value="oldest">Oldest</option>
                  </select>

                  <select
                    value={moodFilter}
                    onChange={(e) => {
                      setMoodFilter(e.target.value);
                      setPage(1);
                    }}
                    className="px-3 py-2 rounded-md border bg-white dark:bg-gray-800 dark:border-gray-700 text-sm text-gray-800 dark:text-gray-100 cursor-pointer ml-2"
                  >
                    <option value="">All moods</option>
                    <option value="Happy">Happy</option>
                    <option value="Neutral">Neutral</option>
                    <option value="Sad">Sad</option>
                  </select>
                </div>

                <div className="w-full">
                  <input
                    aria-label="Search journals"
                    placeholder="Search journals..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 min-w-0 px-3 py-2 rounded-md border bg-white dark:bg-gray-800 dark:border-gray-700 text-sm text-gray-800 dark:text-gray-100 w-full"
                  />
                </div>
              </div>

              <div className="ml-auto">
                <Link onClick={() => startProgress()} href="/editor">
                  <Button
                    className="inline-flex h-12 animate-shimmer items-center justify-center rounded-sm border border-slate-800 dark:border-slate-600 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-4 font-medium text-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
                  >
                    <div className="flex justify-center items-center gap-4">
                      <CirclePlus className="text-orange-400 hover:text-orange-600 !h-4 !w-4" />
                      <div className="text-md">New Journal</div>
                    </div>
                  </Button>
                </Link>
              </div>
            </div>
          </header>

          <main className="space-y-4">
            {(() => {
              const filtered = journals.filter((j) =>
                searchQuery
                  ? j.plainText
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase())
                  : true,
              );

              if (filtered.length === 0) {
                return (
                  <div className="w-full py-20 flex flex-col items-center justify-center text-center">
                    <div className="p-6 rounded-xl bg-gradient-to-br from-white to-orange-50 dark:from-transparent dark:to-gray-800 shadow-md border border-gray-100 dark:border-gray-700">
                      <div className="w-20 h-20 flex items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-200 mx-auto">
                        <PlusCircle className="w-8 h-8" />
                      </div>
                      <h2 className="mt-6 text-2xl font-semibold text-gray-900 dark:text-gray-100">
                        No Journal Entries
                      </h2>
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 max-w-md">
                        You haven&apos;t added any journal entries yet. Capture your
                        thoughts and moods — your Journals will appear here.
                      </p>
                      <div className="mt-6">
                        <Link onClick={() => startProgress()} href="/editor">
                          <Button
                            className="bg-black hover:bg-gray-800 rounded-sm text-gray-100 border dark:border-gray-100"
                          >
                            New Journal
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              }

              return filtered.map((journal) => (
                <Link onClick={() => startProgress()} key={journal.id} href={`/journals/${journal.id}`}>
                  <Card
                    className={`rounded-lg overflow-hidden transform transition-all duration-300 hover:scale-[1] hover:shadow-2xl dark:hover:shadow-gray-500 dark:hover:scale-[1.01] cursor-pointer mb-4 ${moodColor[journal.sentiment.overallEmotion]}`}
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
                </Link>
              ));
            })()}

            <div className="flex flex-col sm:flex-row gap-2 items-center justify-between mt-4 pt-4">
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Showing {(page - 1) * limit + 1} -{" "}
                {Math.min(page * limit, total)} of {total}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="bg-black hover:bg-gray-800 rounded-sm text-gray-100 border dark:border-gray-100"
                >
                  Prev
                </Button>

                <div className="px-2">
                  Page {page} of {Math.max(1, Math.ceil(total / limit))}
                </div>

                <Button
                  disabled={page >= Math.ceil(total / limit)}
                  onClick={() => setPage((p) => p + 1)}
                  className="bg-black hover:bg-gray-800 rounded-sm text-gray-100 border dark:border-gray-100"
                >
                  Next
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
