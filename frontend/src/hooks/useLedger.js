import { useState, useEffect } from "react";

export default function useLedger() {
  const [transactions, setTransactions] = useState([]);
  const [revaluations, setRevaluations] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    setTransactions(JSON.parse(localStorage.getItem("transactions") || "[]"));
    setRevaluations(JSON.parse(localStorage.getItem("revaluations") || "[]"));
  }, []);

  const save = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const addTransaction = (t) => {
    const newTxs = [...transactions, { ...t, id: crypto.randomUUID() }];
    setTransactions(newTxs);
    save("transactions", newTxs);
  };

  const addRevaluation = (r) => {
    const newRev = [...revaluations, { ...r, id: crypto.randomUUID() }];
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
