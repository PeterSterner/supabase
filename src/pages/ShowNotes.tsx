import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FaPen } from "react-icons/fa";
import { useNavigate } from "react-router";
import { useAuth } from "../Supabase";
import { Note } from "../types/NoteInterface";
import { Button } from "../components/Button";

function ShowNotes() {
  const { listNotes, user } = useAuth();
  const navigate = useNavigate();
  const [notes, setNotes] = useState<Array<Note>>([]);
  const { t } = useTranslation();

  useEffect(() => {
    if (!user) {
      navigate("/logind");
    } else {
      const fetchNotes = async () => {
        const { data, error } = await listNotes();
        if (error) {
          console.error("Fejl ved hentning af noter:", error);
          return;
        }
        console.log("Noter hentet:", data);
        setNotes(data || []);
      };
      fetchNotes();
    }
  }, [listNotes, navigate, user]);

  if (!user) {
    return null;
  }

  return (
    <>
      <h1 className="text-3xl">{t("your_notes")}</h1>

      <p className="mt-4">{t("my_notes_intro")}</p>

      <table className="min-w-full divide-y divide-gray-200 mt-4">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Titel
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Note
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              {t("Created")}
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              {t("Updated")}
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            ></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {notes.map((note) => (
            <tr key={note.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {note.title}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {note.content}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {new Date(note.created_at).toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {new Date(note.updated_at).toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <EditNote noteId={note.id} />
                {" | "}
                <DeleteNote noteId={note.id} setNotes={setNotes} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Button onClick={() => navigate("/tilføjnote")}>
        <FaPen className="text-white" />
        <span>{t("add_note")}</span>
      </Button>
    </>
  );
}

function EditNote({ noteId }: { noteId: number }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <button
      className="text-red-600 hover:text-red-800"
      onClick={async () => {
        navigate("/tilføjnote/" + noteId); // Placeholder navigation
      }}
    >
      {t("edit_note")}
    </button>
  );
}

function DeleteNote({
  noteId,
  setNotes,
}: {
  noteId: number;
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
}) {
  const { deleteNote, listNotes } = useAuth();
  const { t } = useTranslation();
  return (
    <button
      className="text-red-600 hover:text-red-800"
      onClick={async () => {
        const { data, error } = await deleteNote(noteId);
        if (error) {
          console.error("Fejl ved sletning af note:", error);
          alert("Fejl ved sletning af note.");
          return;
        } else {
          console.log("Note slettet:", data);
          alert("Note slettet.");
          const { data: updatedNotes, error: listError } = await listNotes();
          if (listError) {
            console.error("Fejl ved opdatering af noter:", listError);
            return;
          }
          if (updatedNotes) {
            setNotes(updatedNotes);
          }
        }
      }}
    >
      {t("delete_note")}
    </button>
  );
}

export default ShowNotes;
