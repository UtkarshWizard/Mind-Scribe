import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import NavBar from "../components/NavBar-Dashboard";

export default function Editor() {
  return (
    <div className="z-50 top-0 w-full">
      <NavBar />
      <div className="w-full">
        <SimpleEditor />
      </div>
    </div>
  );
}
