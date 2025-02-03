"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import axios from "axios"

type Emotion = "Happy" | "Neutral" | "Sad";

interface Journal {
  id: string;
  content: string;
  sentiment: {
    emotions: {
      Happy: number;
      Neutral: number;
      Sad: number;
    };
    overallEmotion: Emotion;
    friends_response: string;
    personalized_recommendation: {
      quote: string;
      exercise: string;
    };
  };
  createdAt: string;
  updatedAt: string | null;
}

export function UpdateJournalPage({ id }: { id: string }) {
  const router = useRouter()
  const [journal, setJournal] = useState<Journal | null>(null);
  // console.log(journal?.content) 
  const [content, setContent] = useState(`${journal?.content}`);
  const [loading , setLoading] = useState(false);
  
  useEffect(() => {
    const fetchJournal = async () => {
      try {
        const response = await axios.get(`/api/journal/${id}`);
        if (response.data) {
            setJournal(response.data);
        }
        return 
      } catch (err) {
        console.error("Error fetching journal for today:", err);
      }
    };

    fetchJournal();
  }, [id]);

  useEffect(() => {
    if (journal?.content) {
      setContent(journal.content);
    }
  }, [journal]);
  

  // console.log(content)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    setLoading(true); // Start loading state
  
    try {
      // Send the updated journal content to the backend
      await axios.put(`/api/journal/${id}`, { content });
  
      toast({
        title: "Journal Updated",
        description: "Your journal entry has been successfully updated.",
      });
  
      // Redirect to the journal detail page
      router.push(`/journals/${id}`);
    } catch (error) {
      console.error("Error updating journal:", error);
  
      toast({
        title: "Error",
        description: "Failed to update the journal. Please try again later.",
      });
    } finally {
      // Stop loading state in both success and error cases
      setLoading(false);
    }
  };
  

  return (
    <div className="container mx-auto p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card>
          <CardHeader>
            <CardTitle>Update Journal Entry</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="content">Journal</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  className="min-h-[200px]"
                />
              </div>
              <div className="flex justify-center flex-col gap-6  md:justify-between md:flex-row items-center">
                { journal?.updatedAt && <p className="text-sm text-muted-foreground">
                  Last updated: {new Intl.DateTimeFormat("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    timeZone: "UTC",
                  }).format(new Date(journal.updatedAt))}
                </p>}
                <div className="space-x-2">
                  <Button type="button" variant="outline" onClick={() => router.back()}>
                    Cancel
                  </Button>
                  <Button disabled={loading} type="submit">{loading ? "Updating" : "Update Journal"}</Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

