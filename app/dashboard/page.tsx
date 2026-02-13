"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { WelcomeBanner } from "../components/welcome-banner";
import NavBar from "../components/NavBar-Dashboard";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Flame, Notebook, NotebookPen } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { RecentJournalEntries } from "../components/recentJournal";
import { JournalEntry } from "../components/journalEntry";
import axios from "axios";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const journalRef = useRef<HTMLDivElement>(null);
  const [journalHeight, setJournalHeight] = useState<number | null>(null);
  const [date , setDate] = useState<Date | undefined>(new Date());
  const [totalEntries , setTotalEntries] = useState();
  const [streak , setStreak] = useState();
  const [entryDates, setEntryDates] = useState<string[]>([]);
  const [streakDates, setStreakDates] = useState<string[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/"); // Redirect to the homepage or login page if not authenticated
    }
  }, [status, router]);
  
  useEffect(() => {
    if (!journalRef.current) return;

    const observer = new ResizeObserver(([entry]) => {
      setJournalHeight(entry.contentRect.height);
    });

    observer.observe(journalRef.current);

    return () => observer.disconnect();
  }, []);

  const refetchStats = async () => {
    try {
      const response = await axios.get('/api/journal');
      setTotalEntries(response.data.total);
      setStreak(response.data.streak)
      const rawEntries = response.data.journals || []
      if (Array.isArray(rawEntries) && rawEntries.length > 0) {
        const toLocal = (d: string | Date) => {
          const date = new Date(d)
          const y = date.getFullYear()
          const m = String(date.getMonth() + 1).padStart(2, "0")
          const day = String(date.getDate()).padStart(2, "0")
          return `${y}-${m}-${day}`
        }
        const dates = rawEntries
          .map((e) => {
            if (typeof e === "string") return toLocal(e);
            if (e && e.createdAt) return toLocal(e.createdAt);
            return null;
          })
          .filter((d): d is string => Boolean(d));
        const uniq = Array.from(new Set(dates));
        setEntryDates(uniq as string[]);

        // compute current streak dates (contiguous backwards from today)
        const dateSet = new Set(uniq)
        const today = new Date()
        const streakArr: string[] = []
        const cur = new Date(today)
        while (true) {
          const key = `${cur.getFullYear()}-${String(cur.getMonth()+1).padStart(2,'0')}-${String(cur.getDate()).padStart(2,'0')}`
          if (dateSet.has(key)) {
            streakArr.push(key)
            cur.setDate(cur.getDate() - 1)
          } else break
        }
        setStreakDates(streakArr)
      } else {
        // Reset dates if no entries
        setEntryDates([]);
        setStreakDates([]);
      }
    } catch (error) {
      console.error("Failed to fetch stats", error);
    }
  }

  useEffect(() => {
    refetchStats()
  }, [])

  // Optionally, you can display a loading skeleton while the session is being verified
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        <Skeleton className="h-32 w-32" />
      </div>
    );
  }

  if (!session) return null;


  return (
    <div className="z-50 top-0 w-full">
      <NavBar />
      <div className="bg-background text-foreground lg:max-w-6xl mx-auto flex flex-col items-center min-h-screen">
        <motion.main
          className="flex-1 w-full p-4 md:py-6 md:px-12 space-y-6 flex flex-col"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            variants={itemVariants}
            className="w-full flex justify-center"
          >
            <div className="w-full">
              <WelcomeBanner />
            </div>
          </motion.div>

          {/* Stats Cards */}

          <div className="grid md:grid-cols-2 grid-cols-1 gap-4 w-full lg:max-w-6xl max-w-4xl mx-auto justify-center">
            <div className="flex items-center justify-between border border-gray-700 dark:bg-gray-900 bg-gray-100 rounded-xl p-4">
              <div className="bg-orange-500/20 rounded-full p-3 mb-3">
                <Flame className="text-orange-500 h-10 w-10" />
              </div>
              <div className="flex flex-col px-4">
                <div className="font-bold text-4xl text-right">{streak || 0}</div>
                <div className="text-lg text-right">Day Streak</div>
              </div>
            </div>

            <div className="flex items-center justify-between border border-gray-700 dark:bg-gray-900 bg-gray-100 rounded-xl p-4">
              <div className="bg-orange-500/20 rounded-full p-3 mb-3">
                <NotebookPen className="text-orange-500 h-10 w-10" />
              </div>
              <div className="flex flex-col px-4">
                <div className="font-bold text-4xl text-right">{totalEntries || 0}</div>
                <div className="text-lg text-right">Journal Entries</div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Notebook />
              <span className="text-xl">Today&apos;s Entry</span>
            </div>
          </div>

          <div className="grid md:grid-cols-5 grid-cols-2 justify-center items-center md:items-start gap-4">
            <div ref={journalRef} className="md:col-span-3 col-span-2 min-h-full">
              <JournalEntry onDelete={refetchStats} />
            </div>
            <div
              className="md:col-span-2 col-span-2 md:sticky md:top-24"
              style={{
                maxHeight: journalHeight ? `${journalHeight}px` : "auto",
              }}
            >
              <div className="overflow-y-auto max-h-full flex justify-center items-center">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-lg border-2 border-gray-600 w-full"
                  entryDates={entryDates}
                  streakDates={streakDates}
                  captionLayout="dropdown"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-between sm:items-center pt-4">
            <div className="flex items-center gap-2">
              <Notebook />
              <span className="text-xl">Recent Journals</span>
            </div>
            <Link href="/journals">
              <button
                className="px-8 py-2 rounded-sm relative bg-slate-900 text-white text-sm sm:text-md hover:shadow-2xl hover:shadow-black/[0.2] dark:hover:shadow-gray-400/[0.1] transition duration-200 border border-slate-600"
              >
                <div className="absolute inset-x-0 dark:h-px h-1 dark:w-1/2 w-[80%] mx-auto -top-px shadow-2xl bg-gradient-to-r from-transparent dark:via-orange-700 via-orange-800 to-transparent" />
                <span className="relative z-20">Show All Entries</span>
              </button>
            </Link>
          </div>
          <RecentJournalEntries />
        </motion.main>
      </div>
    </div>
  );
}
