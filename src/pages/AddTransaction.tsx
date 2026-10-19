
import { useState } from "react";
import type { FormEvent } from "react";
import { Button } from "../components/Button";
import Modal from "../components/Modal";
import type { Transaktion } from "../types/TransaktionInterface";

type TransactionForm = Omit<Transaktion, "antal"> & { antal: string };

const initialValues: TransactionForm = {
  reference_nummer: "",
  handelsdato: "",
  valørdato: "",
  valuta: "DKK",
  handelskurs: "",
  kursværdi: "",
  handelsomkostninger: "",
  kurtage: "",
  afregningsbeløb: "",
  antal: "",
  ISIN: "",
  titel: "",
};

const fields: {
  name: keyof TransactionForm;
  label: string;
  type: "text" | "date" | "number";
}[] = [
  { name: "reference_nummer", label: "Referencenummer", type: "text" },
  { name: "handelsdato", label: "Handelsdato", type: "date" },
  { name: "valørdato", label: "Valørdato", type: "date" },
  { name: "valuta", label: "Valuta", type: "text" },
  { name: "handelskurs", label: "Handelskurs", type: "number" },
  { name: "kursværdi", label: "Kursværdi", type: "number" },
  { name: "handelsomkostninger", label: "Handelsomkostninger", type: "number" },
  { name: "kurtage", label: "Kurtage", type: "number" },
  { name: "afregningsbeløb", label: "Afregningsbeløb", type: "number" },
  { name: "antal", label: "Antal", type: "number" },
  { name: "ISIN", label: "ISIN", type: "text" },
  { name: "titel", label: "Titel", type: "text" },
];

type AddTransactionProps = {
  onClose: () => void;
  onSaved: (transaction: Transaktion) => void;
};

function AddTransaction({ onClose, onSaved }: AddTransactionProps) {
  const [values, setValues] = useState<TransactionForm>(initialValues);
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const antal = Number(values.antal);
    if (!Number.isSafeInteger(antal)) {
      setError("Antal skal være et heltal inden for det understøttede interval.");
      return;
    }

    const transaction: Transaktion = {
      ...values,
      reference_nummer: values.reference_nummer.trim(),
      valuta: values.valuta.trim().toUpperCase(),
      ISIN: values.ISIN.trim().toUpperCase(),
      titel: values.titel.trim(),
      antal,
    };

    if (!transaction.reference_nummer || !transaction.titel) {
      setError("Udfyld referencenummer og titel.");
      return;
    }

    try {
      const stored: unknown = JSON.parse(localStorage.getItem("transaktioner") ?? "[]");
      if (!Array.isArray(stored)) {
        throw new Error("Ugyldigt format for gemte transaktioner.");
      }
      localStorage.setItem("transaktioner", JSON.stringify([...stored, transaction]));
    } catch {
      setError("Transaktionen kunne ikke gemmes lokalt. Dine indtastninger er bevaret.");
      return;
    }
    onSaved(transaction);
  }

  return (
    <Modal title="Tilføj transaktion" isOpen onClose={onClose}>
      <p className="mb-4">Transaktioner gemmes lokalt i denne browser og sendes ikke til din konto.</p>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {fields.map(({ name, label, type }) => (
          <div key={name}>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700">
              {label}
            </label>
            <input
              id={name}
              name={name}
              type={type}
              required
              step={type === "number" ? (name === "antal" ? "1" : "any") : undefined}
              pattern={name === "valuta" ? "[A-Za-z]{3}" : undefined}
              maxLength={name === "valuta" ? 3 : undefined}
              placeholder={name === "valuta" ? "DKK" : undefined}
              value={values[name]}
              onChange={(event) => {
                setValues((previous) => ({ ...previous, [name]: event.target.value }));
                setError("");
              }}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        ))}
        {error && <p role="alert" className="text-red-600 sm:col-span-2">{error}</p>}
        <div className="flex flex-wrap justify-end gap-3 sm:col-span-2">
          <Button type="button" variant="secondary" onClick={onClose}>Annuller</Button>
          <Button type="submit">Tilføj transaktion</Button>
        </div>
      </form>
    </Modal>
  );
}

export default AddTransaction;
