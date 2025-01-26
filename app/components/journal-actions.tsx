import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function JournalActions({ id }: { id: string }) {
  const router = useRouter();

  const deleteJournal = async () => {
    try {
      // Call the delete API
      await axios.delete(`/api/journal/${id}`);

      toast({
        title: "Deleted !",
        description: "Journal Deleted Succesfully",
      });

      // Redirect to the dashboard after deletion
      router.push("/dashboard");
    } catch (error) {
      console.error("Error deleting journal:", error);

      toast({
        title: "Error",
        description: "Failed to delete the journal. Please try again later.",
      });
    }
  };
  return (
    <div className="flex space-x-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => router.push(`/update/journal/${id}`)}
      >
        <Pencil className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="hover:bg-red-300"
        onClick={deleteJournal}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
