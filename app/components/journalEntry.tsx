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
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

export function JournalQuickEntry() {
  const [entry, setEntry] = useState("");
  const [submittedEntry, setSubmittedEntry] = useState("");
  const [loading, setLoading] = useState(false);

  // State to hold the sentiment data
  const [Sentiment, setSentiment] = useState({
    overall: "",
    categories: [
      { name: "Happy", percentage: 0 },
      { name: "Neutral", percentage: 0 },
      { name: "Sad", percentage: 0 },
    ],
  });

  const [Recommendation, setRecommendation] = useState({
    quote: "",
    exercise: "",
  });

  useEffect(() => {
    const fetchSentimentData = async () => {
      try {
        const date = new Date().toISOString(); // Current date in ISO format
        const response = await axios.get(`/api/journal/sentiment`);
        const sentimentData = response.data?.sentiment_analysis;
        console.log(sentimentData);
        const overall_emotion = response.data?.overall_emotion;
        const recommendation = response.data?.recommendations;
        console.log(recommendation);

        // Map the fetched data into the format needed for the component
        if (sentimentData) {
          setSentiment({
            overall: overall_emotion || "",
            categories: [
              { name: "Happy", percentage: sentimentData?.Happy || 0 },
              { name: "Neutral", percentage: sentimentData?.Neutral || 0 },
              { name: "Sad", percentage: sentimentData?.Sad || 0 },
            ],
          });
        }

        if (recommendation) {
          setRecommendation({
            quote: recommendation.quote,
            exercise: recommendation.exercise,
          });
        }
      } catch (error) {
        console.error("Error fetching sentiment data:", error);
      }
    };

    fetchSentimentData();
  }, []);

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
    };

    fetchJournalForToday();
  }, []); // Fetch on mount

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
        setSubmittedEntry(getResponse.data.journal.content); // Set submitted journal
        setEntry(""); // Clear the textarea
        const sentimentResponse = await axios.get(`/api/journal/sentiment`);
        const sentimentData = sentimentResponse.data?.sentiment_analysis;
        const overall_emotion = sentimentResponse.data?.overall_emotion;
        const recommendation = sentimentResponse.data?.recommendations;

        if (sentimentData) {
          setSentiment({
            overall: overall_emotion || "",
            categories: [
              { name: "Happy", percentage: sentimentData?.Happy || 0 },
              { name: "Neutral", percentage: sentimentData?.Neutral || 0 },
              { name: "Sad", percentage: sentimentData?.Sad || 0 },
            ],
          });
        }

        if (recommendation) {
          setRecommendation({
            quote: recommendation.quote,
            exercise: recommendation.exercise,
          });
        }
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
        <div>
          <Card className="overflow-hidden">
            <CardHeader className="bg-primary text-primary-foreground">
              <CardTitle className="text-2xl">Your Journal Entry</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-lg text-gray-800">{submittedEntry}</p>
            </CardContent>
            <CardFooter className="flex justify-end bg-muted p-4">
              <button className="p-[3px] relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
                <div className="px-8 py-2 bg-black rounded-[6px] relative group transition duration-200 text-white hover:bg-transparent">
                  Update Journal
                </div>
              </button>
            </CardFooter>
          </Card>

          {/* Sentiments card */}

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-xl">Sentiment Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg mb-4">
                Your mood today is:{" "}
                <strong>{Sentiment.overall || "Loading..."}</strong>
              </p>
              <div className="space-y-4">
                {Sentiment.categories.map((category) => (
                  <div key={category.name}>
                    <div className="flex justify-between mb-1">
                      <span>{category.name}</span>
                      <span>{category.percentage}%</span>
                    </div>
                    <Progress value={category.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recommendation card */}

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-xl">
                Personalized Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col justify-center gap-4">
              <motion.div
                className="bg-muted p-4 rounded-lg transition-shadow duration-300 ease-in-out hover:shadow-lg"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <p className="mb-2">{Recommendation.quote || "Loading..."}</p>
              </motion.div>
              <motion.div
                className="bg-muted p-4 rounded-lg transition-shadow duration-300 ease-in-out hover:shadow-lg"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <p className="mb-2">
                  {Recommendation.exercise || "Loading..."}
                </p>
                <Button variant="link" className="p-0 text-blue-700">
                  <a href={"/"} target="_blank" rel="noopener noreferrer">
                    Explore More
                  </a>
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <>
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
                  <div className="px-8 py-2 bg-black rounded-[6px] relative group transition duration-200 text-white hover:bg-transparent">
                    {loading ? "Submitting..." : "Submit"}
                  </div>
                </button>
              </CardFooter>
            </form>
          </Card>
          <motion.div
            className="transition-shadow duration-300 ease-in-out hover:shadow-lg"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            // transition={{ duration: 0.5 }}
          >
            <Card className="mt-6 bg-gradient-to-br from-purple-200 to-pink-200 dark:from-purple-900 dark:to-pink-900">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-purple-800 dark:text-purple-200">
                  Ready for Today's Insights?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-gray-600 dark:text-gray-300 text-lg">
                  Enter today's journal to unlock your <span className="font-semibold italic">Personalized Sentiment
                  Analysis</span> and <span className="font-semibold italic">Recommendations</span>.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </motion.div>
  );
}
