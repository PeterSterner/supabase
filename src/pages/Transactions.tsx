import { useEffect, useRef, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { useAuth } from "../Supabase";
import { Button } from "../components/Button";
import AddTransaction from "./AddTransaction";
import CreateDepot from "../components/CreateDepot";
import type { DepotVisning } from "../types/DepotInterface";
import type {
  GemtTransaktion,
  Transaktion,
} from "../types/TransaktionInterface";

const columns: { key: keyof Transaktion; label: string; numeric?: boolean }[] =
  [
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

function Transactions() {
  const { user, listTransactions, deleteTransaction, hasDepot } = useAuth();
  const [depotStatus, setDepotStatus] = useState<{ userId?: string; exists: boolean; error: string }>({ exists: false, error: "" });
  const isCheckingDepot = depotStatus.userId !== user?.id || !user;
  const canAddTransaction = !isCheckingDepot && depotStatus.exists && !depotStatus.error;
  const [{ transactions, error }, setData] = useState<{
    transactions: GemtTransaktion[];
    error: string;
  }>({ transactions: [], error: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [deleteError, setDeleteError] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  const deletingRef = useRef(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isCreatingDepot, setIsCreatingDepot] = useState(false);
  const [depots, setDepots] = useState<DepotVisning[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;
    setIsAdding(false);
    setDepots([]);
    setDepotStatus({ exists: false, error: "" });
    if (!user) return;
    const userId = user.id;
    async function checkDepot() {
      try {
        const { data, error } = await hasDepot();
        if (active) setDepotStatus({ userId, exists: Boolean(data), error: error ? "Depotet kunne ikke kontrolleres. Genindlæs siden for at prøve igen." : "" });
      } catch {
        if (active) setDepotStatus({ userId, exists: false, error: "Depotet kunne ikke kontrolleres. Genindlæs siden for at prøve igen." });
      }
    }
    void checkDepot();
    return () => { active = false; };
  }, [user, hasDepot]);

  useEffect(() => {
    let active = true;
    async function load() {
      setIsLoading(true);
      setData({ transactions: [], error: "" });
      try {
        if (!user) return;
        const { data, error } = await listTransactions();
        if (!active) return;
        setData({
          transactions: error ? [] : (data ?? []),
          error: error
            ? "Transaktionerne kunne ikke indlæses fra databasen."
            : "",
        });
      } catch {
        if (active)
          setData({
            transactions: [],
            error: "Transaktionerne kunne ikke indlæses fra databasen.",
          });
      } finally {
        if (active) setIsLoading(false);
      }
    }
    void load();
    return () => {
      active = false;
    };
  }, [user, listTransactions]);

  async function handleDeleteTransaction(transaction: GemtTransaktion) {
    if (!user || deletingRef.current) return;
    if (
      transaction.id == null &&
      transactions.filter(
        (item) => item.reference_nummer === transaction.reference_nummer,
      ).length !== 1
    ) {
      setDeleteError(
        "Transaktionen kan ikke slettes entydigt. Genindlæs siden og prøv igen.",
      );
      return;
    }
    deletingRef.current = true;
    setDeleting(transaction.reference_nummer);
    setDeleteError("");
    setMessage("");
    try {
      const { data, error } = await deleteTransaction(transaction);
      if (error || !data) {
        setDeleteError(
          "Transaktionen kunne ikke slettes fra databasen. Prøv igen.",
        );
        return;
      }
      setData((previous) => ({
        ...previous,
        transactions: previous.transactions.filter(
          (item) => item !== transaction,
        ),
      }));
      setMessage("Transaktionen er slettet.");
    } catch {
      setDeleteError(
        "Transaktionen kunne ikke slettes fra databasen. Prøv igen.",
      );
    } finally {
      deletingRef.current = false;
      setDeleting(null);
    }
  }

  return (
    <section className="min-w-0 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl">Transaktioner</h1>
        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            disabled={!canAddTransaction}
            aria-describedby="depot-requirement"
            onClick={() => {
              if (!canAddTransaction) return;
              setMessage("");
              setIsAdding(true);
            }}
          >
            Tilføj transaktion
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              setMessage("");
              setIsCreatingDepot(true);
            }}
          >
            Opret depot
          </Button>
        </div>
      </div>
      <p>Her vises transaktionerne gemt på din konto.</p>
      <p id="depot-requirement" role={depotStatus.error ? "alert" : "status"}>
        {isCheckingDepot ? "Kontrollerer depot…" : depotStatus.error || (!depotStatus.exists ? "Opret et depot, før du kan tilføje en transaktion." : "Du kan nu tilføje transaktioner.")}
      </p>
      {message && <p role="status">{message}</p>}
      {deleteError && (
        <p role="alert" className="text-red-600">
          {deleteError}
        </p>
      )}
      {isCreatingDepot && (
        <CreateDepot
          onClose={() => setIsCreatingDepot(false)}
          onCreate={(depot) => {
            setDepotStatus({ userId: user?.id, exists: true, error: "" });
            setDepots((previous) => [...previous, depot]);
            setIsCreatingDepot(false);
            setMessage("Depotet er gemt på din konto.");
          }}
        />
      )}
      {depots.length > 0 && (
        <section aria-label="Depoter" className="space-y-2">
          <h2 className="text-xl">Depoter</h2>
          <ul className="list-inside list-disc">
            {depots.map((depot, index) => (
              <li key={index}>
                {depot.navn} ({depot.handelsplatform.navn})
              </li>
            ))}
          </ul>
        </section>
      )}
      {isAdding && canAddTransaction && (
        <AddTransaction
          onClose={() => setIsAdding(false)}
          onSaved={(transaction) => {
            setData((previous) => ({
              transactions: [...previous.transactions, transaction],
              error: "",
            }));
            setIsAdding(false);
            setMessage("Transaktionen er gemt på din konto.");
          }}
        />
      )}
      {isLoading ? (
        <p role="status">Indlæser transaktioner…</p>
      ) : error ? (
        <p role="alert" className="text-red-600">
          {error}
        </p>
      ) : transactions.length === 0 ? (
        <p>
          Der er endnu ingen transaktioner. Tilføj din første transaktion via
          knappen ovenfor.
        </p>
      ) : (
        <div
          className="overflow-x-auto rounded-lg border border-gray-300 focus:outline-indigo-500"
          role="region"
          aria-label="Transaktionstabel"
          tabIndex={0}
        >
          <table className="w-full whitespace-nowrap text-left text-sm">
            <caption className="sr-only">Transaktioner</caption>
            <thead className="bg-gray-800 text-white">
              <tr>
                {columns.map(({ key, label, numeric }) => (
                  <th
                    key={key}
                    scope="col"
                    className={`px-4 py-3 ${numeric ? "text-right" : "text-left"}`}
                  >
                    {label}
                  </th>
                ))}
                <th scope="col" className="px-4 py-3">
                  <span className="sr-only">Slet transaktion</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300">
              {transactions.map((transaction, index) => (
                <tr key={transaction.id ?? index}>
                  {columns.map(({ key, numeric }) => (
                    <td
                      key={key}
                      className={`px-4 py-3 ${numeric ? "text-right tabular-nums" : "text-left"}`}
                    >
                      {transaction[key]}
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => void handleDeleteTransaction(transaction)}
                      disabled={deleting !== null}
                      aria-label={`Slet transaktion ${transaction.reference_nummer}`}
                      title="Slet transaktion"
                      aria-busy={deleting === transaction.reference_nummer}
                      className="rounded p-2 text-red-600 hover:bg-red-50 hover:text-red-800 focus-visible:outline-2 focus-visible:outline-red-600 disabled:cursor-wait disabled:opacity-50"
                    >
                      <FaTrash aria-hidden="true" />
                    </button>
                  </td>
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
