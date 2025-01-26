import { motion } from "framer-motion"

interface JournalContentProps {
  content: string
}

export function JournalContent({ content }: JournalContentProps) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="mt-4">
      <div
        className="bg-[#f7f3e8] p-6 rounded-lg shadow-inner min-h-[300px] relative"
        style={{
          backgroundImage:
            "linear-gradient(#e5e5e5 1px, transparent 1px), linear-gradient(90deg, #e5e5e5 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      >
        <div className="absolute top-0 left-0 w-[3px] h-full bg-red-200"></div>
        <p className="text-lg leading-relaxed whitespace-pre-wrap font-handwriting">{content}</p>
      </div>
    </motion.div>
  )
}

