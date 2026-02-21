"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { JournalActions } from "./journal-actions";
import { AIFriendlyResponse } from "./ai-response";
import { SentimentInsights } from "./sentimentInsights";
import { PersonalizedRecommendations } from "./personalizedRecommendations";
import { useEffect, useState } from "react";
import axios from "axios";
import { Skeleton } from "./Skeleton";
import { useEditor, EditorContent } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { Typography } from "@tiptap/extension-typography";
import { TextAlign } from "@tiptap/extension-text-align";
import { SmileIcon, MehIcon, FrownIcon } from "lucide-react";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import { Selection } from "@tiptap/extensions";
import "@/components/tiptap-templates/simple/simple-editor.scss";
import { ImageUploadNode } from "@/components/tiptap-node/image-upload-node/image-upload-node-extension";
import { HorizontalRule } from "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension";
import "@/components/tiptap-node/blockquote-node/blockquote-node.scss";
import "@/components/tiptap-node/code-block-node/code-block-node.scss";
import "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss";
import "@/components/tiptap-node/list-node/list-node.scss";
import "@/components/tiptap-node/image-node/image-node.scss";
import "@/components/tiptap-node/heading-node/heading-node.scss";
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss";
import { handleImageUpload, MAX_FILE_SIZE } from "@/lib/tiptap-utils";
import { Image } from "@tiptap/extension-image";
import { Highlight } from "@tiptap/extension-highlight";
import { Superscript } from "@tiptap/extension-superscript";
import { Subscript } from "@tiptap/extension-subscript";

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
    friends_response: string;
    personalized_recommendation: {
      quote: string;
      exercise: string;
    };
  };
  createdAt: string;
  updatedAt: string | null;
}

export function JournalDetailPage({ id }: { id: string }) {
  const [journal, setJournal] = useState<Journal | null>(null); // Correct state type
  useEffect(() => {
    const fetchJournal = async () => {
      try {
        const response = await axios.get(`/api/journal/${id}`);
        // API returns journal data under `journal` or directly
        const data = response.data.journal || response.data;
        setJournal(data);
      } catch (err) {
        console.error("Error fetching journal:", err);
      }
    };

    fetchJournal();
  }, [id]);

  const editor = useEditor({
    immediatelyRender: false,
    editable: false,
    editorProps: {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        "aria-label": "Main content area, start typing to enter text.",
        class: "simple-editor",
      },
    },
    extensions: [
      StarterKit.configure({
        horizontalRule: false,
        link: {
          openOnClick: false,
          enableClickSelection: true,
        },
      }),
      HorizontalRule,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      Typography,
      Image,
      Superscript,
      Subscript,
      Selection,
      ImageUploadNode.configure({
        accept: "image/*",
        maxSize: MAX_FILE_SIZE,
        limit: 3,
        upload: handleImageUpload,
        onError: (error) => console.error("Upload failed:", error),
      }),
    ],
  });

  // Update editor content when journal loads — handle JSON, object, or HTML
  useEffect(() => {
    if (!editor || !journal) return;
    try {
      let content = (journal).content ?? journal.plainText ?? "";

      // If content is a string, try to parse JSON (some APIs store serialized JSON)
      if (typeof content === "string") {
        content = JSON.parse(content);
      }

      editor.commands.setContent(content);
    } catch (e) {
      console.error("Failed to set editor content:", e);
    }
  }, [editor, journal]);

  if (!journal) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header Card Skeleton */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <Card className="overflow-hidden bg-gradient-to-br from-white via-indigo-50 to-white/60 dark:from-gray-950 dark:via-gray-800 dark:to-gray-950 border border-transparent">
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <Skeleton className="h-8 w-64 mb-2" />
                  <Skeleton className="h-4 w-48" />
                </div>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-24" />
                  <Skeleton className="h-10 w-10 rounded-full" />
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-32 w-full mt-4" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* AI Response Skeleton */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.12 }}
        >
          <Card className="overflow-hidden bg-gradient-to-br from-white to-blue-50 dark:from-gray-950 dark:to-gray-800">
            <CardContent className="p-6">
              <Skeleton className="h-6 w-48 mb-4" />
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sentiment Insights Skeleton */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.18 }}
        >
          <Card className="overflow-hidden bg-gradient-to-br from-white to-purple-50 dark:from-gray-950 dark:to-gray-800">
            <CardContent className="p-6">
              <Skeleton className="h-6 w-48 mb-4" />
              <div className="grid grid-cols-3 gap-4">
                <Skeleton className="h-24 w-full rounded-lg" />
                <Skeleton className="h-24 w-full rounded-lg" />
                <Skeleton className="h-24 w-full rounded-lg" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Personalized Recommendations Skeleton */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.24 }}
        >
          <Card className="overflow-hidden bg-gradient-to-br from-white to-green-50 dark:from-gray-950 dark:to-gray-800">
            <CardContent className="p-6">
              <Skeleton className="h-6 w-48 mb-4" />
              <div className="space-y-4">
                <div>
                  <Skeleton className="h-5 w-32 mb-2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
                <div>
                  <Skeleton className="h-5 w-32 mb-2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  const moodIcon = {
    Happy: (
      <SmileIcon className="w-6 h-6 text-yellow-800 dark:text-yellow-300" />
    ),
    Neutral: <MehIcon className="w-6 h-6 text-black dark:text-gray-200" />,
    Sad: <FrownIcon className="w-6 h-6 text-red-600 dark:text-red-400" />,
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <Card className="overflow-hidden bg-gradient-to-br from-white via-indigo-50 to-white/60 dark:from-gray-950 dark:via-gray-800 dark:to-gray-950 border border-transparent hover:shadow-lg dark:hover:shadow-gray-800 transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
                  {new Intl.DateTimeFormat("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    timeZone: "UTC",
                  }).format(new Date(journal.createdAt))}
                </h2>
                {journal.updatedAt && (
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Updated on {new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(journal.updatedAt))}</p>
                )}
              </div>

              <div className="flex items-center md:flex-row flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Mood</span>
                  <div className="p-2 rounded-full bg-white/60 dark:bg-gray-800 border">
                    {moodIcon[journal.sentiment.overallEmotion]}
                  </div>
                </div>
                <JournalActions id={id} />
              </div>
            </div>

            <div className="mt-4">
              {editor ? <EditorContent editor={editor} role="presentation" className="" /> : <div className="text-gray-500">Loading content...</div>}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.12 }}>
        <AIFriendlyResponse journalContent={journal.sentiment.friends_response} />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.18 }}>
        <SentimentInsights emotions={journal.sentiment.emotions} overallEmotion={journal.sentiment.overallEmotion} />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.24 }}>
        <PersonalizedRecommendations recommendation={journal.sentiment.personalized_recommendation} />
      </motion.div>
    </div>
  );
}
