"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from "next/link"
import { PlusCircle } from "lucide-react"
import { type Journal, dummyJournals } from "@/types/journal"
import { YearNavigation } from "@/components/YearNavigation"
import { JournalEntry } from "@/components/JournalEntry"

function groupJournalsByYear(journals: Journal[]) {
  return journals.reduce(
    (acc, journal) => {
      const year = new Date(journal.date).getFullYear()
      if (!acc[year]) {
        acc[year] = []
      }
      acc[year].push(journal)
      return acc
    },
    {} as Record<number, Journal[]>,
  )
}

export default function JournalsPage() {
  const groupedJournals = groupJournalsByYear(dummyJournals)
  const years = Object.keys(groupedJournals)
    .map(Number)
    .sort((a, b) => b - a)
  const [selectedYear, setSelectedYear] = useState(years[0])

  return (
    <div className="flex h-screen bg-pastel-yellow/20">
      <aside className="w-64 bg-white p-6 border-r border-pastel-blue/30">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">My Journals</h1>
        <YearNavigation years={years} selectedYear={selectedYear} onYearSelect={setSelectedYear} />
        <Button asChild className="w-full mt-6 bg-pastel-purple hover:bg-pastel-purple/90 text-gray-800">
          <Link href="/journals/new">
            <PlusCircle className="mr-2 h-5 w-5" /> New Entry
          </Link>
        </Button>
      </aside>
      <main className="flex-1 p-6 overflow-hidden">
        <ScrollArea className="h-full pr-4">
          <div className="space-y-6">
            {groupedJournals[selectedYear]
              ?.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((journal) => (
                <JournalEntry key={journal.id} journal={journal} />
              ))}
          </div>
        </ScrollArea>
      </main>
    </div>
  )
}

