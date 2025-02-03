"use client";

import { JournalDetailPage } from "@/app/components/journal-detail-page";
import NavBar from "@/app/components/NavBar-Dashboard";
import { useParams } from "next/navigation";

export default function Page() {
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      <NavBar />
      <JournalDetailPage id={id} />
    </div>
  );
}
