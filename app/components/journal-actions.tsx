import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { SquarePenIcon, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DeleteConfirmationDialog } from "./delete-confirmation-dialog";

export function JournalActions({ id }: { id: string }) {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteJournal = async () => {
    setIsDeleting(true);
    try {
      // Call the delete API
      await axios.delete(`/api/journal/${id}`);

      toast({
        title: "Gone!",
        description: "Your journal entry has been deleted successfully.",
        variant: "success",
      });

      // Redirect to the dashboard after deletion
      setShowDeleteDialog(false);
      router.push("/dashboard");
    } catch (error) {
      console.error("Error deleting journal:", error);

      toast({
        title: "Oops!",
        description: "Something went wrong. Try again.",
        variant: "destructive",
      });
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.push(`/update/journal/${id}`)}
          className="hover:bg-yellow-400 hover:dark:text-black"
        >
          <SquarePenIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="hover:bg-red-500 hover:text-white"
          onClick={() => setShowDeleteDialog(true)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <DeleteConfirmationDialog
        isOpen={showDeleteDialog}
        onConfirm={deleteJournal}
        onCancel={() => setShowDeleteDialog(false)}
        isLoading={isDeleting}
      />
    </>
  );
}
