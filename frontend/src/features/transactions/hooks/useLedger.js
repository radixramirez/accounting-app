import { useState, useEffect } from "react";

const isBrowser = typeof window !== "undefined";
const hasLocalStorage = () => isBrowser && typeof window.localStorage !== "undefined";

const safeParse = (value) => {
  try {
    return JSON.parse(value ?? "[]");
  } catch (error) {
    console.warn("Failed to parse ledger data from storage", error);
    return [];
  }
};

const generateId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `ledger-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export default function useLedger() {
  const [transactions, setTransactions] = useState([]);
  const [revaluations, setRevaluations] = useState([]);

  // Load from localStorage on mount when available
  useEffect(() => {
    if (!hasLocalStorage()) {
      return;
    }

    setTransactions(safeParse(window.localStorage.getItem("transactions")));
    setRevaluations(safeParse(window.localStorage.getItem("revaluations")));
  }, []);

  const save = (key, data) => {
    if (!hasLocalStorage()) {
      return;
    }
    window.localStorage.setItem(key, JSON.stringify(data));
  };

  const addTransaction = (t) => {
    const newTxs = [...transactions, { ...t, id: generateId() }];
    setTransactions(newTxs);
    save("transactions", newTxs);
  };

  const addRevaluation = (r) => {
    const newRev = [...revaluations, { ...r, id: generateId() }];
    setRevaluations(newRev);
    save("revaluations", newRev);
  };

  return {
    transactions,
    addTransaction,
    revaluations,
    addRevaluation,
  };
}
