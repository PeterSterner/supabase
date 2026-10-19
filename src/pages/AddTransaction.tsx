
import { useState } from "react";
import type { FormEvent } from "react";
import { Button } from "../components/Button";
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

function AddTransaction() {
  const [values, setValues] = useState<TransactionForm>(initialValues);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
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
      setValues({ ...initialValues });
      setMessage("Transaktionen er gemt lokalt i denne browser.");
    } catch {
      setError("Transaktionen kunne ikke gemmes lokalt. Dine indtastninger er bevaret.");
    }
  }

  return (
    <section className="max-w-lg mx-auto space-y-4">
      <h1 className="text-3xl">Tilføj transaktion</h1>
      <p>Transaktioner gemmes lokalt i denne browser og sendes ikke til din konto.</p>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
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
                setMessage("");
                setError("");
              }}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        ))}
        {error && <p role="alert" className="text-red-600">{error}</p>}
        {message && <p role="status">{message}</p>}
        <Button type="submit" fullWidth>Tilføj transaktion</Button>
      </form>
    </section>
  );
}

export default AddTransaction;
