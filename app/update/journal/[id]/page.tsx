import NavBar from "@/app/components/NavBar-Dashboard";
import { UpdateJournalPage } from "@/app/components/update-journal-page";


export default function Page({ params }: { params: { id: string } }) {
  return <div>
    <NavBar />
      <UpdateJournalPage id={params.id} />
    </div>
}

