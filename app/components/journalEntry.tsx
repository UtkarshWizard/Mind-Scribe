"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { NextResponse } from "next/server";

export function JournalQuickEntry() {
  const [entry, setEntry] = useState("");
  const [submittedEntry, setSubmittedEntry] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchJournalForToday = async () => {
      try {
        const date = new Date().toISOString(); // Current date in ISO format
        const response = await axios.get(
          `/api/journal?date=${encodeURIComponent(date)}`
        );
        if (response.data.journal) {
          setSubmittedEntry(response.data.journal.content); // Set the journal content if found
        }
      } catch (error) {
        console.error("Error fetching journal for today:", error);
      }
      //  finally {
      //   setLoading(false); // Stop the loading state
      // }
    };

    fetchJournalForToday();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("/api/journal", { content: entry });

      if (response.status === 200) {
        const date = new Date().toISOString();
        const getResponse = await axios.get(
          `/api/journal?date=${encodeURIComponent(date)}`
        );
        setSubmittedEntry(getResponse.data.journal.content);
        setEntry(""); 
      }
    } catch (error) {
      console.error("Error submitting journal:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {submittedEntry ? (
        <Card className="overflow-hidden">
          <CardHeader className="bg-primary text-primary-foreground">
            <CardTitle className="text-2xl">Your Journal Entry</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-lg text-gray-800">{submittedEntry}</p>
          </CardContent>
          <CardFooter className="flex justify-end bg-muted p-4">
              <button
                className="p-[3px] relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
                <div className="px-8 py-2 bg-black rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent">
                  Update Journal
                </div>
              </button>
            </CardFooter>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <CardHeader className="bg-primary text-primary-foreground">
            <CardTitle className="text-2xl">Quick Journal Entry</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="p-6">
              <Textarea
                placeholder="Write about your day, emotions, or anything on your mind..."
                value={entry}
                onChange={(e) => setEntry(e.target.value)}
                className="min-h-[160px] mb-4"
              />
            </CardContent>
            <CardFooter className="flex justify-end bg-muted p-4">
              <button
                disabled={loading}
                className="p-[3px] relative"
                type="submit"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
                <div className="px-8 py-2 bg-black rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent">
                  {loading ? "Submitting..." : "Submit"}
                </div>
              </button>
            </CardFooter>
          </form>
        </Card>
      )}
    </motion.div>
  );
}
