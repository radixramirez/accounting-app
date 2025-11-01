import React, { useState, useEffect } from "react";
import useLedger from "../hooks/useLedger";

const LEDGER_FEATURE_READY = false;

const FX_RATES = {
  USD: 1,
  AUD: 0.65,
  GBP: 1.22,
  IDR: 0.000065,
  BTC: 68000,
  ozAU: 2400,
};

export default function TransactionsPage() {
  const { transactions, addTransaction } = useLedger();
  const [accounts, setAccounts] = useState([]);
  const [form, setForm] = useState({
    from: "",
    to: "",
    amount: "",
    fromAsset: "",
    toAsset: "",
  });

  useEffect(() => {
    const storedAccounts = JSON.parse(localStorage.getItem("accounts") || "[]");
    setAccounts(storedAccounts);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const getAccount = (name) => accounts.find((a) => a.name === name);
  const getAssets = (acc) => acc?.assets?.map((a) => a.symbol) || [];

  const handleFromChange = (e) => {
    const from = e.target.value;
    const acc = getAccount(from);
    const fromAsset =
      acc?.type === "multi" ? "" : acc?.assets?.[0]?.symbol || "USD";
    setForm({ ...form, from, fromAsset });
  };

  const handleToChange = (e) => {
    const to = e.target.value;
    const acc = getAccount(to);
    const toAsset =
      acc?.type === "multi" ? "" : acc?.assets?.[0]?.symbol || "USD";
    setForm({ ...form, to, toAsset });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!LEDGER_FEATURE_READY) {
      return;
    }
    if (!form.amount || form.amount <= 0) return;

    const fromAcc = getAccount(form.from);
    const toAcc = getAccount(form.to);

    const fromSymbol = form.fromAsset || fromAcc?.assets?.[0]?.symbol || "USD";
    const toSymbol = form.toAsset || toAcc?.assets?.[0]?.symbol || "USD";

    const converted =
      (parseFloat(form.amount) * FX_RATES[fromSymbol]) / FX_RATES[toSymbol];

    const newTx = {
      ...form,
      timestamp: new Date().toISOString(),
      amount: parseFloat(form.amount),
      convertedAmount: converted,
      fromAsset: fromSymbol,
      toAsset: toSymbol,
    };

    addTransaction(newTx);
    setForm({ from: "", to: "", amount: "", fromAsset: "", toAsset: "" });
  };

  const removeLatestTransaction = () => {
    if (!LEDGER_FEATURE_READY) {
      return;
    }
    if (transactions.length === 0) {
      alert("No transactions to remove.");
      return;
    }
    if (typeof window !== "undefined" && window.localStorage) {
      const remaining = transactions.slice(0, -1);
      if (remaining.length === 0) {
        window.localStorage.removeItem("transactions");
      } else {
        window.localStorage.setItem("transactions", JSON.stringify(remaining));
      }
      window.location.reload();
    }
  };

  const controlsDisabled = !LEDGER_FEATURE_READY;

  const renderAssetLogic = () => {
    const fromAcc = getAccount(form.from);
    const toAcc = getAccount(form.to);
    if (!fromAcc || !toAcc) return null;

    const fromIsMulti = fromAcc.type === "multi";
    const toIsMulti = toAcc.type === "multi";

    if (!fromIsMulti && !toIsMulti)
      return (
        <p className="text-gray-300 text-sm mt-2">
          {fromAcc.assets[0].symbol} → {toAcc.assets[0].symbol}
        </p>
      );

    if (!fromIsMulti && toIsMulti)
      return (
        <div className="flex items-center gap-2 mt-2">
          <span className="text-gray-300 text-sm">
            {fromAcc.assets[0].symbol} →
          </span>
          <select
            name="toAsset"
            value={form.toAsset}
            onChange={handleChange}
            disabled={controlsDisabled}
            className="bg-zinc-900 border border-zinc-700 rounded-md px-2 py-1 text-white text-sm focus:ring-2 focus:ring-cyan-400 outline-none disabled:cursor-not-allowed disabled:opacity-60"
          >
            <option value="">Select asset</option>
            {getAssets(toAcc).map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>
      );

    if (fromIsMulti && !toIsMulti)
      return (
        <div className="flex items-center gap-2 mt-2">
          <select
            name="fromAsset"
            value={form.fromAsset}
            onChange={handleChange}
            disabled={controlsDisabled}
            className="bg-zinc-900 border border-zinc-700 rounded-md px-2 py-1 text-white text-sm focus:ring-2 focus:ring-cyan-400 outline-none disabled:cursor-not-allowed disabled:opacity-60"
          >
            <option value="">Select asset</option>
            {getAssets(fromAcc).map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
          <span className="text-gray-300 text-sm">
            → {toAcc.assets[0].symbol}
          </span>
        </div>
      );

    return (
      <div className="flex items-center gap-2 mt-2">
        <select
          name="fromAsset"
          value={form.fromAsset}
          onChange={handleChange}
          disabled={controlsDisabled}
          className="bg-zinc-900 border border-zinc-700 rounded-md px-2 py-1 text-white text-sm focus:ring-2 focus:ring-cyan-400 outline-none disabled:cursor-not-allowed disabled:opacity-60"
        >
          <option value="">From asset</option>
          {getAssets(fromAcc).map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
        <span className="text-gray-300 text-sm">→</span>
        <select
          name="toAsset"
          value={form.toAsset}
          onChange={handleChange}
          disabled={controlsDisabled}
          className="bg-zinc-900 border border-zinc-700 rounded-md px-2 py-1 text-white text-sm focus:ring-2 focus:ring-cyan-400 outline-none disabled:cursor-not-allowed disabled:opacity-60"
        >
          <option value="">To asset</option>
          {getAssets(toAcc).map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-indigo-950 text-white p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-indigo-300">
          Transaction Ledger
        </h1>

        {controlsDisabled && (
          <div className="mb-6 rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-amber-100">
            <p className="font-semibold tracking-wide">TODO</p>
            <p className="text-sm text-amber-200/90">
              Transaction management is not yet connected to the backend. The form
              below is disabled until the implementation is completed.
            </p>
          </div>
        )}

        {/* --- Add Transaction Form --- */}
        <form
          onSubmit={handleSubmit}
          className="bg-white/10 backdrop-blur-lg p-6 rounded-xl border border-white/10 mb-10 shadow-lg"
        >
          <h2 className="text-lg font-semibold mb-4 text-indigo-300">
            Add New Transaction
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
            <select
              name="from"
              value={form.from}
              onChange={handleFromChange}
              disabled={controlsDisabled}
              className="bg-zinc-900 border border-zinc-700 rounded-md p-3 text-white focus:ring-2 focus:ring-cyan-400 outline-none transition disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="">— From Account —</option>
              {accounts.map((acc, i) => (
                <option key={i} value={acc.name}>
                  {acc.name}
                </option>
              ))}
            </select>

            <select
              name="to"
              value={form.to}
              onChange={handleToChange}
              disabled={controlsDisabled}
              className="bg-zinc-900 border border-zinc-700 rounded-md p-3 text-white focus:ring-2 focus:ring-cyan-400 outline-none transition disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="">— To Account —</option>
              {accounts.map((acc, i) => (
                <option key={i} value={acc.name}>
                  {acc.name}
                </option>
              ))}
            </select>

            <input
              type="number"
              name="amount"
              min="0"
              step="any"
              value={form.amount}
              onChange={handleChange}
              onWheel={(e) => e.target.blur()}
              onFocus={(e) => e.target.select()}
              placeholder="Amount"
              disabled={controlsDisabled}
              className="bg-zinc-900 border border-zinc-700 rounded-md p-3 text-white placeholder-gray-500 text-right focus:ring-2 focus:ring-cyan-400 outline-none transition disabled:cursor-not-allowed disabled:opacity-60"
              style={{ appearance: "textfield", MozAppearance: "textfield" }}
              onKeyDown={(e) => {
                if (e.key === "-" || e.key === "e") e.preventDefault();
              }}
            />
          </div>

          <div className={controlsDisabled ? "opacity-50" : undefined}>{renderAssetLogic()}</div>

          <div className="flex justify-between mt-5">
            <button
              type="submit"
              disabled={controlsDisabled}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md font-medium transition disabled:cursor-not-allowed disabled:opacity-60"
            >
              Add Transaction
            </button>

            <button
              type="button"
              onClick={removeLatestTransaction}
              disabled={controlsDisabled}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-md font-medium transition disabled:cursor-not-allowed disabled:opacity-60"
            >
              Remove Latest
            </button>
          </div>
        </form>

        {/* --- Transactions Table --- */}
        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl border border-white/10 shadow-lg">
          <h2 className="text-lg font-semibold mb-4 text-indigo-300">
            All Transactions
          </h2>

          {transactions.length === 0 ? (
            <p className="text-gray-400 text-center py-4">
              No transactions yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-sm text-indigo-300 border-b border-white/10">
                    <th className="py-2">Date</th>
                    <th className="py-2">From</th>
                    <th className="py-2">To</th>
                    <th className="py-2">From Asset</th>
                    <th className="py-2">To Asset</th>
                    <th className="py-2 text-right">Amount</th>
                    <th className="py-2 text-right">Converted</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t) => (
                    <tr
                      key={t.id}
                      className="border-b border-white/5 hover:bg-white/10 transition"
                    >
                      <td className="py-2">{t.timestamp.slice(0, 10)}</td>
                      <td className="py-2">{t.from || "-"}</td>
                      <td className="py-2">{t.to || "-"}</td>
                      <td className="py-2">{t.fromAsset}</td>
                      <td className="py-2">{t.toAsset}</td>
                      <td className="py-2 text-right">
                        {t.amount.toLocaleString()}
                      </td>
                      <td className="py-2 text-right text-indigo-300">
                        {t.convertedAmount.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
