import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { getPreview } from "./recentJournal";
import { SquarePen, Trash } from "lucide-react";

export function JournalEntry() {
  const [entry, setEntry] = useState("");
  const [submittedEntry, setSubmittedEntry] = useState("");
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");

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
        const response = await axios.get(`/api/journal/sentiment`);
        const sentimentData = response.data?.sentiment_analysis;
        // console.log(sentimentData);
        const overall_emotion = response.data?.overall_emotion;
        const recommendation = response.data?.recommendations;
        // console.log(recommendation);

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
        const date = new Date().toISOString();
        const response = await axios.get(
          `/api/journal?date=${encodeURIComponent(date)}`,
        );
        if (response.data.journal) {
          const plainJournal = getPreview(response.data.journal.plainText, 30);
          setSubmittedEntry(plainJournal);
          const date = new Date(
            response.data.journal.createdAt,
          ).toLocaleDateString("en-GB");
          if (response.data.journal.updatedAt) {
            const updatedAt = new Date(
              response.data.journal.updatedAt,
            ).toLocaleDateString("en-GB");

            setUpdatedAt(updatedAt);
          }
          setDate(date);
          setId(response.data.journal.id);
        }
      } catch (error) {
        console.error("Error fetching journal for today:", error);
      }
    };

    fetchJournalForToday();
  }, []); // Fetch on mount

  const router = useRouter();

  return (
    <>
      {submittedEntry ? (
        <div className="w-full p-4 flex flex-col rounded-md border border-gray-800 dark:border-gray-600">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2 text-xl mb-2">
              <div className="flex flex-col gap-2">
                {date}
                {updatedAt && <div> Updated At - {updatedAt} </div>}
              </div>
              <div className="flex gap-2 items-center">
                <button className="hover:cursor-pointer hover:translate-y-[2px] transition-all duration-200"><SquarePen /></button>
                <button className="hover:cursor-pointer hover:translate-y-[2px] transition-all duration-200"><Trash className="text-red-600" /></button>
              </div>
            </div>
            {submittedEntry} ....
          </div>
          {/* Sentiments card */}

          <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border border-gray-900 dark:border-gray-600 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-xl font-medium">
                Sentiment Insights
              </CardTitle>
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

          <div className="mt-4">
            <div className="text-xl font-medium">
              Personalized Recommendations
            </div>

            <div className="flex flex-col justify-center gap-4 mt-2">
              <motion.div
                className="bg-gray-100 dark:bg-slate-900 p-4 rounded-lg transition-shadow duration-300 ease-in-out hover:shadow-lg border border-gray-800 dark:border-gray-500 dark:shadow-slate-700"
                whileHover={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <p className="mb-2">{Recommendation.quote || "Loading..."}</p>
              </motion.div>
              <motion.div
                className="bg-gray-100 dark:bg-slate-900 p-4 rounded-lg transition-shadow duration-300 ease-in-out hover:shadow-lg border border-gray-800 dark:border-gray-500 dark:shadow-slate-700"
                whileHover={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <p className="mb-2">
                  {Recommendation.exercise || "Loading..."}
                </p>
                <Button
                  variant="link"
                  className="p-0 text-blue-700 dark:text-blue-400"
                  onClick={() => {
                    router.push("/exercises");
                  }}
                >
                  Explore More
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      ) : (
        <div className="md:col-span-2 flex flex-col items-center justify-center border-2 border-gray-700 h-full w-full rounded-md p-4 gap-4">
          <span className="pb-2 text-xl text-center">
            This is your space. Start with a single thought from today.
          </span>
          <div className="text-center">
            <button
              onClick={() => router.push("/editor")}
              className="px-6 py-2 bg-black text-white rounded-sm transform hover:-translate-y-1 transition duration-400"
            >
              Create Entry
            </button>
          </div>
        </div>
      )}
    </>
  );
}
