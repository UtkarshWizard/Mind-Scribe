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
  const { data:session, status } = useSession();
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
    <div className="">
      <div className="group relative">
        <NavBar />
      </div>
      <div className="flex h-screen bg-background text-foreground">
        <motion.main
          className="flex-1 overflow-y-auto p-4 md:py-6 md:px-12 space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          
          <motion.div variants={itemVariants}>
            <WelcomeBanner />
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <motion.div variants={itemVariants}>
                <JournalQuickEntry />
              </motion.div>
            </div>
            <div className="space-y-6">
              <motion.div variants={itemVariants}>
                <MoodTracker />
              </motion.div>
              <Suspense fallback={<Skeleton className="h-96 w-full" />}>
                <motion.div variants={itemVariants}>
                  <RecentJournalEntries />
                </motion.div>
              </Suspense>
            </div>
          </div>
        </motion.main>
      </div>
    </div>
  );
}
