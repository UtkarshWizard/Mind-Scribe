"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { JournalActions } from "./journal-actions";
import { AIFriendlyResponse } from "./ai-response";
import { SentimentInsights } from "./sentimentInsights";
import { PersonalizedRecommendations } from "./personalizedRecommendations";
import { useEffect, useState } from "react";
import axios from "axios";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Typography from "@tiptap/extension-typography";
import TextAlign from "@tiptap/extension-text-align";
import { CalendarIcon, SmileIcon, MehIcon, FrownIcon } from "lucide-react";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import { ImageUploadNode } from "@/components/tiptap-node/image-upload-node";
import { handleImageUpload, MAX_FILE_SIZE } from "@/lib/tiptap-utils";
import Image from "@tiptap/extension-image";
import Highlight from "@tiptap/extension-highlight";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";

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
    ],
  });

  // Update editor content when journal loads
  useEffect(() => {
    if (!editor || !journal) return;
    try {
      const content = (journal.content as any) || journal.plainText || "";
        editor.commands.setContent(content);
    } catch (e) {
      console.error("Failed to set editor content:", e);
    }
  }, [editor, journal]);

  if (!journal) {
    return (
      <div className="min-h-[300px] flex items-center justify-center">
        <div className="text-center text-gray-500">Loading journal...</div>
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
        <Card className="overflow-hidden bg-gradient-to-br from-white via-indigo-50 to-white/60 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 border border-transparent hover:shadow-lg transition-shadow">
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

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Mood</span>
                  <div className="p-2 rounded-full bg-white/60 dark:bg-gray-800 border">
                    {moodIcon[journal.sentiment.overallEmotion]}
                  </div>
                </div>
                <JournalActions id={id} />
              </div>
            </div>

            <div className="mt-6 prose prose-lg max-w-none dark:prose-invert">
              {editor ? <EditorContent editor={editor} /> : <div className="text-gray-500">Loading content...</div>}
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
