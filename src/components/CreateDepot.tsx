import { useState } from "react";
import type { FormEvent } from "react";
import { Button } from "./Button";
import Modal from "./Modal";
import { handelsplatforme } from "../types/DepotInterface";
import type { Depot } from "../types/DepotInterface";

type CreateDepotProps = {
  onClose: () => void;
  onCreate: (depot: Depot) => void;
};

export default function CreateDepot({ onClose, onCreate }: CreateDepotProps) {
  const [navn, setNavn] = useState("");
  const [handelsplatform, setHandelsplatform] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const platform = handelsplatforme.find((value) => value === handelsplatform);
    if (!navn.trim() || !platform) {
      setError("Udfyld navn og vælg en handelsplatform.");
      return;
    }
    onCreate({ navn: navn.trim(), handelsplatform: platform });
  }

  const inputClassName = "mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500";

  return (
    <Modal title="Opret depot" isOpen onClose={onClose}>
      <p className="mb-4">Depotet tilføjes kun til denne visning og gemmes endnu ikke på din konto.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="depot-navn" className="block text-sm font-medium">Navn</label>
          <input
            id="depot-navn"
            name="navn"
            type="text"
            required
            value={navn}
            onChange={(event) => { setNavn(event.target.value); setError(""); }}
            className={inputClassName}
          />
        </div>
        <div>
          <label htmlFor="depot-handelsplatform" className="block text-sm font-medium">Handelsplatform</label>
          <select
            id="depot-handelsplatform"
            name="handelsplatform"
            required
            value={handelsplatform}
            onChange={(event) => { setHandelsplatform(event.target.value); setError(""); }}
            className={inputClassName}
          >
            <option value="" disabled>Vælg handelsplatform</option>
            {handelsplatforme.map((platform) => (
              <option key={platform} value={platform}>{platform}</option>
            ))}
          </select>
        </div>
        {error && <p role="alert" className="text-red-600">{error}</p>}
        <div className="flex flex-wrap justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>Annuller</Button>
          <Button type="submit">Opret depot</Button>
        </div>
      </form>
    </Modal>
  );
}
