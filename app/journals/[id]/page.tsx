import { JournalDetailPage } from "@/app/components/journal-detail-page";
import NavBar from "@/app/components/NavBar-Dashboard";


export default async function Page({ params }: { params: { id: string } }) {
  const id = await params.id
  return <div>
    <NavBar />
    <JournalDetailPage id={id} />
  </div> 
}
