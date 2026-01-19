"use client";

import { Suspense, useEffect } from "react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { RecentJournalEntries } from "../components/recentJournal";
import { MoodTracker } from "../components/todaysmood";
import { JournalQuickEntry } from "../components/journalEntry";
import { WelcomeBanner } from "../components/welcome-banner";
import NavBar from "../components/NavBar-Dashboard";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { CirclePlus, Flame, NotebookPen } from "lucide-react";
import { Button } from "@/components/ui/button";

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

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/"); // Redirect to the homepage or login page if not authenticated
    }
  }, [status, router]);

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
      <div className="bg-background text-foreground lg:max-w-6xl max-w-4xl mx-auto flex flex-col items-center min-h-screen">
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
          <div className="grid md:grid-cols-2 grid-cols-1 gap-4 w-full lg:max-w-6xl max-w-4xl mx-auto justify-center">
            <div className="flex items-center justify-between border border-gray-700 dark:bg-gray-900 bg-gray-100 rounded-xl p-4">
              <div className="bg-orange-500/20 rounded-full p-3 mb-3">
                <Flame className="text-orange-500 h-10 w-10" />
              </div>
              <div className="flex flex-col px-4">
                <div className="font-bold text-4xl text-right">0</div>
                <div className="text-lg text-right">Day Streak</div>
              </div>
            </div>

            <div className="flex items-center justify-between border border-gray-700 dark:bg-gray-900 bg-gray-100 rounded-xl p-4">
              <div className="bg-orange-500/20 rounded-full p-3 mb-3">
                <NotebookPen className="text-orange-500 h-10 w-10" />
              </div>
              <div className="flex flex-col px-4">
                <div className="font-bold text-4xl text-right">0</div>
                <div className="text-lg text-right">Journal Entries</div>
              </div>
            </div>
          </div>
          <div className="text-right">
            <Button className="inline-flex h-12 animate-shimmer items-center justify-center rounded-sm border border-slate-800 dark:border-slate-600 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
              <div className="flex justify-center items-center gap-4">
                <CirclePlus className="text-orange-400 hover:text-orange-600 !h-4 !w-4" />
                <div className="text-md">New Journal</div>
              </div>
            </Button>
          </div>
        </motion.main>
      </div>
    </div>
  );
}
