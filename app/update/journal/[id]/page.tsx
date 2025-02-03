"use client";

import { useParams } from "next/navigation";
import NavBar from "@/app/components/NavBar-Dashboard";
import { UpdateJournalPage } from "@/app/components/update-journal-page";

export default function Page() {
  // Extract `id` using useParams hook
  const { id } = useParams<{ id: string }>(); 

  return (
    <div>
      <NavBar />
      <UpdateJournalPage id={id} />
    </div>
  );
}
