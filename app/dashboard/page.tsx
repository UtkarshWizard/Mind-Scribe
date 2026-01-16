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
import { Flame } from "lucide-react";

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
      <div className="bg-background text-foreground">
        <motion.main
          className="flex-1 overflow-y-none p-4 md:py-6 md:px-12 space-y-6 "
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <WelcomeBanner />
          </motion.div>
          <div className="grid grid-cols-2 gap-4 max-w-6xl mx-auto">
            <div className="flex flex-col items-center justify-center border border-gray-200 rounded-3xl p-4">
              <div className="bg-orange-500/20 rounded-full p-3 mb-3">
                <Flame className="text-orange-500 h-6 w-6" />
              </div>
              <div className="font-bold text-4xl">
                0
              </div>
              <div className="text-lg">
                Day Streak
              </div>
            </div>
            <div className="flex flex-col items-center justify-center border border-gray-200 rounded-3xl p-4">
              <div>
                <Flame className="text-orange-500 h-8 w-8" />
              </div>
              <div className="font-bold text-2xl">
                0
              </div>
              <div className="text-lg">
                Day Streak
              </div>
            </div>
          </div>
        </motion.main>
      </div>
    </div>
  );
}
