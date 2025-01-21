"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export function JournalQuickEntry() {
  const [entry, setEntry] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting entry:", { entry });
    setEntry("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
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
            <button className="p-[3px] relative" type="submit">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
              <div className="px-8 py-2 bg-black rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent">
                Submit
              </div>
            </button>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  );
}
