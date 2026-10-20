import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Button } from "./Button";
import Modal from "./Modal";
import type { Depot, DepotVisning, Handelsplatform } from "../types/DepotInterface";
import { supabase, useAuth } from "../Supabase";

type CreateDepotProps = {
  onClose: () => void;
  onCreate: (depot: DepotVisning) => void;
};

export default function CreateDepot({ onClose, onCreate }: CreateDepotProps) {
  const { addDepot } = useAuth();
  const [navn, setNavn] = useState("");
  const [handelsplatform, setHandelsplatform] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const savingRef = useRef(false);
  const [platforme, setPlatforme] = useState<Handelsplatform[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let active = true;
    async function loadPlatforms() {
      try {
        const { data, error } = await supabase
          .from("handelsplatforme")
          .select("id, navn")
          .order("navn")
          .returns<Handelsplatform[]>();
        if (error) throw error;
        if (active) setPlatforme(data ?? []);
      } catch {
        if (active) setLoadError("Handelsplatforme kunne ikke indlæses. Luk og åbn formularen for at prøve igen.");
      } finally {
        if (active) setIsLoading(false);
      }
    }
    void loadPlatforms();
    return () => { active = false; };
  }, []);

  function handleClose() {
    if (!savingRef.current) onClose();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (savingRef.current) return;
    setError("");
    const platform = platforme.find((value) => value.id === handelsplatform);
    if (!navn.trim() || !platform) {
      setError("Udfyld navn og vælg en handelsplatform.");
      return;
    }
    const depot: Depot = { navn: navn.trim(), handelsplatform_id: platform.id };
    savingRef.current = true;
    setIsSaving(true);
    try {
      const { error: saveError } = await addDepot(depot);
      if (saveError) {
        setError(`Depotet kunne ikke gemmes: ${saveError.message}`);
        return;
      }
    } catch {
      setError("Depotet kunne ikke gemmes. Dine indtastninger er bevaret.");
      return;
    } finally {
      savingRef.current = false;
      setIsSaving(false);
    }
    onCreate({ ...depot, handelsplatform: platform });
  }

  const inputClassName = "mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500";

  return (
    <Modal title="Opret depot" isOpen onClose={handleClose}>
      <p className="mb-4">Depotet gemmes på din konto.</p>
      <form onSubmit={handleSubmit} aria-busy={isSaving} className="space-y-4">
        <div>
          <label htmlFor="depot-navn" className="block text-sm font-medium">Navn</label>
          <input
            id="depot-navn"
            name="navn"
            type="text"
            required
            disabled={isSaving}
            value={navn}
            onChange={(event) => { setNavn(event.target.value); setError(""); }}
            className={inputClassName}
          />
        </div>
        <div>
          <label htmlFor="depot-handelsplatform" className="block text-sm font-medium">Handelsplatform</label>
          <select
            id="depot-handelsplatform"
            name="handelsplatform_id"
            required
            disabled={isSaving || isLoading || platforme.length === 0}
            value={handelsplatform}
            onChange={(event) => { setHandelsplatform(event.target.value); setError(""); }}
            className={inputClassName}
          >
            <option value="" disabled>{isLoading ? "Indlæser handelsplatforme…" : "Vælg handelsplatform"}</option>
            {platforme.map((platform) => (
              <option key={platform.id} value={platform.id}>{platform.navn}</option>
            ))}
          </select>
        </div>
        {loadError && <p role="alert" className="text-red-600">{loadError}</p>}
        {!isLoading && !loadError && platforme.length === 0 && <p role="status">Der er ingen handelsplatforme at vælge imellem.</p>}
        {error && <p role="alert" className="text-red-600">{error}</p>}
        <div className="flex flex-wrap justify-end gap-3">
          <Button type="button" variant="secondary" onClick={handleClose} disabled={isSaving}>Annuller</Button>
          <Button type="submit" disabled={isSaving || isLoading || platforme.length === 0}>{isSaving ? "Gemmer…" : "Opret depot"}</Button>
        </div>
      </form>
    </Modal>
  );
}
