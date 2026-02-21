"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  description?: string;
  isLoading?: boolean;
}

export function DeleteConfirmationDialog({
  isOpen,
  onConfirm,
  onCancel,
  title = "Delete this entry?",
  description = "This action can't be undone. Say goodbye to this moment forever.",
  isLoading = false,
}: DeleteConfirmationDialogProps) {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="fixed inset-0 z-40 bg-black/50 dark:bg-black/70"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-700 dark:bg-slate-950"
          >
            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
              className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-950"
            >
              <svg
                className="h-6 w-6 text-red-600 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </motion.div>

            {/* Title */}
            <h2 className="mb-2 text-xl font-bold text-slate-950 dark:text-slate-50">
              {title}
            </h2>

            {/* Description */}
            <p className="mb-6 text-slate-600 dark:text-slate-400">
              {description}
            </p>

            {/* Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={onCancel}
                disabled={isLoading}
                className="flex-1 rounded-lg bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
                variant="outline"
              >
                Keep it
              </Button>

              <motion.button
                onHoverStart={() => setIsHovering(true)}
                onHoverEnd={() => setIsHovering(false)}
                onClick={onConfirm}
                disabled={isLoading}
                className="relative flex-1 overflow-hidden rounded-lg bg-gradient-to-r from-red-400 to-red-600 px-4 py-2 text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
              >
                {/* Shimmer effect on hover */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  initial={{ x: "-100%" }}
                  animate={isHovering ? { x: "100%" } : { x: "-100%" }}
                  transition={{ duration: 0.6 }}
                />

                <span className="relative flex items-center justify-center gap-2">
                  {isLoading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full"
                      />
                      Deleting...
                    </>
                  ) : (
                    "Delete anyway"
                  )}
                </span>
              </motion.button>
            </div>

            {/* Footer hint */}
            <p className="mt-4 text-xs text-slate-500 dark:text-slate-500 text-center">
              This is permanent. Like a breakup text you can&apos;t unsend.
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
