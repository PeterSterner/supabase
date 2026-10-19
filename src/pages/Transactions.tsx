import { useState } from "react";
import { Button } from "../components/Button";
import AddTransaction from "./AddTransaction";
import type { Transaktion } from "../types/TransaktionInterface";

const columns: { key: keyof Transaktion; label: string; numeric?: boolean }[] = [
  { key: "reference_nummer", label: "Referencenummer" },
  { key: "handelsdato", label: "Handelsdato" },
  { key: "valørdato", label: "Valørdato" },
  { key: "valuta", label: "Valuta" },
  { key: "handelskurs", label: "Handelskurs", numeric: true },
  { key: "kursværdi", label: "Kursværdi", numeric: true },
  { key: "handelsomkostninger", label: "Handelsomkostninger", numeric: true },
  { key: "kurtage", label: "Kurtage", numeric: true },
  { key: "afregningsbeløb", label: "Afregningsbeløb", numeric: true },
  { key: "antal", label: "Antal", numeric: true },
  { key: "ISIN", label: "ISIN" },
  { key: "titel", label: "Titel" },
];

function isTransaktion(value: unknown): value is Transaktion {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  return columns.every(({ key }) =>
    key === "antal"
      ? Number.isSafeInteger(record[key])
      : typeof record[key] === "string"
  );
}

function loadTransactions(): { transactions: Transaktion[]; error: string } {
  try {
    const stored: unknown = JSON.parse(localStorage.getItem("transaktioner") ?? "[]");
    if (!Array.isArray(stored) || !stored.every(isTransaktion)) {
      throw new Error("Ugyldigt format for gemte transaktioner.");
    }
    return { transactions: stored, error: "" };
  } catch {
    return {
      transactions: [],
      error: "Transaktionerne kunne ikke indlæses fra denne browser.",
    };
  }
}

function Transactions() {
  const [{ transactions, error }, setData] = useState(loadTransactions);
  const [isAdding, setIsAdding] = useState(false);
  const [message, setMessage] = useState("");

  return (
    <section className="min-w-0 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl">Transaktioner</h1>
        <Button type="button" onClick={() => { setMessage(""); setIsAdding(true); }}>
          Tilføj transaktion
        </Button>
      </div>
      <p>Her vises transaktioner gemt lokalt i denne browser.</p>
      {message && <p role="status">{message}</p>}
      {isAdding && (
        <AddTransaction
          onClose={() => setIsAdding(false)}
          onSaved={() => {
            setData(loadTransactions());
            setIsAdding(false);
            setMessage("Transaktionen er gemt lokalt i denne browser.");
          }}
        />
      )}
      {error ? (
        <p role="alert" className="text-red-600">{error}</p>
      ) : transactions.length === 0 ? (
        <p>Der er endnu ingen transaktioner. Tilføj din første transaktion via knappen ovenfor.</p>
      ) : (
        <div
          className="overflow-x-auto rounded-lg border border-gray-300 focus:outline-indigo-500"
          role="region"
          aria-label="Transaktionstabel"
          tabIndex={0}
        >
          <table className="w-full whitespace-nowrap text-left text-sm">
            <caption className="sr-only">Alle lokalt gemte transaktioner</caption>
            <thead className="bg-gray-800 text-white">
              <tr>
                {columns.map(({ key, label, numeric }) => (
                  <th key={key} scope="col" className={`px-4 py-3 ${numeric ? "text-right" : "text-left"}`}>
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300">
              {transactions.map((transaction, index) => (
                <tr key={index}>
                  {columns.map(({ key, numeric }) => (
                    <td key={key} className={`px-4 py-3 ${numeric ? "text-right tabular-nums" : "text-left"}`}>
                      {transaction[key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default Transactions;
