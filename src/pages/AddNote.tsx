import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { useParams } from "react-router";
import Toast from "../components/Toast";
import { useAuth } from "../Supabase";
import { Button } from "../components/Button";

function AddNote() {
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const { addNote, showNote } = useAuth();
  const { noteId } = useParams<{ noteId: string }>();
  const [toastOpen, setToastOpen] = useState(false);

  const { t } = useTranslation();

  useEffect(() => {
    if (noteId) {
      const fetchNote = async () => {
        const { data, error } = await showNote(noteId);
        if (error) {
          console.error("Fejl ved hentning af note:", error);
          return;
        }
        if (data) {
          setTitle(data.title);
          setNote(data.content);
        }
      };
      fetchNote();
    } else {
      setTitle("");
      setNote("");
    }
  }, [noteId, showNote]);

  return (
    <>
      <h1 className="text-3xl">{t("add_note")}</h1>
      <form className="max-w-lg mx-auto">
        <div className="flex flex-col space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              {t("title")}
            </label>
            <input
              type="text"
              id="title"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="note"
              className="block text-sm font-medium text-gray-700"
            >
              {t("content")}
            </label>
            <textarea
              id="note"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              rows={4}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            ></textarea>
          </div>
          <div>
            <Button
              type="submit"
              fullWidth={true}
              onClick={async (e: React.MouseEvent<HTMLButtonElement>) => {
                e.preventDefault();
                console.log("Tilføj note:", title, note);
                const { data, error } = await addNote(title, note);
                if (error) {
                  console.error("Fejl ved tilføjelse af note:", error);
                  alert("Fejl ved tilføjelse af note.");
                  return;
                } else {
                  console.log("Note tilføjet:", data);
                  setToastOpen(true);
                  setTitle("");
                  setNote("");
                }
              }}
            >
              {noteId ? "Opdater note" : "Tilføj note"}
            </Button>
            <Toast
              message="Note gemt!"
              isOpen={toastOpen}
              onClose={() => setToastOpen(false)}
            />
          </div>
        </div>
      </form>
    </>
  );
}
export default AddNote;
