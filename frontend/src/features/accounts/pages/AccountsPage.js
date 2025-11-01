import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  createAccount as createAccountApi,
  deleteAccount as deleteAccountApi,
  getAccounts as fetchAccounts,
} from "../../../api/accounts";
import { getBalances as fetchBalances } from "../../../api/balances";

const USD_RATES = {
  USD: 1,
  AUD: 0.65,
  GBP: 1.22,
  IDR: 0.000065,
  BTC: 68000,
  ozAU: 2400,
};

const DENOM_OPTIONS = ["USD", "AUD", "GBP", "IDR", "BTC", "ozAU"];

export default function AccountsPage() {
  const [accounts, setAccounts] = useState([]);
  const [balances, setBalances] = useState([]);
  const [denomination, setDenomination] = useState("USD");
  const [showModal, setShowModal] = useState(false);
  const [newAccount, setNewAccount] = useState({
    name: "",
    type: "single",
  });

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    const acc = await fetchAccounts();
    const bal = await fetchBalances();
    setAccounts(Array.isArray(acc) ? acc : []);
    setBalances(Array.isArray(bal) ? bal : []);
  };

  const createAccount = async () => {
    if (!newAccount.name.trim()) return;
    await createAccountApi(newAccount);
    setShowModal(false);
    setNewAccount({ name: "", type: "single" });
    loadAll();
  };

  const deleteAccount = async (id) => {
    await deleteAccountApi(id);
    loadAll();
  };

  // ----- Totals -----
  const totalUSD = balances.reduce((sum, b) => {
    const rate = USD_RATES[b.asset_symbol] || 0;
    return sum + (b.amount || 0) * rate;
  }, 0);

  const denomRateUSD = USD_RATES[denomination] || 1;
  const totalInSelected = denomRateUSD ? totalUSD / denomRateUSD : totalUSD;

  // aggregate assets
  const assetTotals = Object.entries(
    balances.reduce((acc, b) => {
      acc[b.asset_symbol] = (acc[b.asset_symbol] || 0) + b.amount;
      return acc;
    }, {})
  );

  // map balances per account
  const getAccountBalances = (name) =>
    balances.filter((b) => b.account_name === name);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-indigo-950 text-white p-6">
      <style>{`
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type=number] {
          -moz-appearance: textfield;
        }
      `}</style>

      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Accounts</h1>
            <p className="text-indigo-300 text-sm">
              Data synced with backend
            </p>
          </div>

          <div className="flex items-center gap-3">
            <label htmlFor="denom" className="text-sm text-indigo-300">
              Total in:
            </label>
            <select
              id="denom"
              value={denomination}
              onChange={(e) => setDenomination(e.target.value)}
              className="bg-zinc-900 border border-zinc-700 rounded-md px-2 py-1 text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              {DENOM_OPTIONS.map((sym) => (
                <option key={sym} value={sym}>
                  {sym}
                </option>
              ))}
            </select>

            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md font-medium transition"
            >
              + Add Account
            </button>
          </div>
        </header>

        {/* Total Summary */}
        <div className="bg-white/10 rounded-xl border border-white/10 shadow-sm p-4 flex justify-between items-center">
          <span className="text-indigo-300 font-medium">Total Balance</span>
          <span className="text-2xl font-bold">
            {totalInSelected.toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })}{" "}
            {denomination}
          </span>
        </div>

        {/* Asset Breakdown */}
        <div className="bg-white/10 rounded-xl border border-white/10 shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4 text-indigo-300">
            Asset Breakdown
          </h2>
          {assetTotals.length === 0 ? (
            <p className="text-gray-400">No assets to display.</p>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-sm text-indigo-300 border-b border-white/10">
                  <th className="py-2">Asset</th>
                  <th className="py-2 text-right">Total Amount</th>
                  <th className="py-2 text-right">Value in {denomination}</th>
                </tr>
              </thead>
              <tbody>
                {assetTotals.map(([symbol, amount]) => {
                  const usdValue = amount * (USD_RATES[symbol] || 0);
                  const converted =
                    denomRateUSD > 0 ? usdValue / denomRateUSD : usdValue;
                  return (
                    <tr
                      key={symbol}
                      className="border-b border-white/5 hover:bg-white/5 transition"
                    >
                      <td className="py-2 font-medium">{symbol}</td>
                      <td className="py-2 text-right">
                        {amount.toLocaleString(undefined, {
                          maximumFractionDigits: 4,
                        })}
                      </td>
                      <td className="py-2 text-right text-indigo-200">
                        {converted.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                        })}{" "}
                        {denomination}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Account Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts.map((account) => {
            const accBals = getAccountBalances(account.name);
            return (
              <div
                key={account.id}
                className="bg-white/10 hover:bg-white/20 transition rounded-xl p-4 border border-white/10 shadow-sm flex flex-col"
              >
                <Link to={`/account/${account.id}`} className="flex-1">
                  <h2 className="text-lg font-semibold mb-1">{account.name}</h2>
                  <p className="text-sm text-indigo-300 mb-2 capitalize">
                    {account.type} asset account
                  </p>
                </Link>

                {accBals.length > 0 ? (
                  <div className="space-y-1 text-sm">
                    {accBals.map((b) => (
                      <div key={b.id} className="flex justify-between">
                        <span className="text-gray-300">{b.asset_symbol}</span>
                        <span className="text-indigo-100">
                          {b.amount.toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">No balances</p>
                )}

                <button
                  onClick={() => deleteAccount(account.id)}
                  className="mt-3 self-end text-xs text-red-400 hover:text-red-300"
                >
                  Remove
                </button>
              </div>
            );
          })}
        </div>

        {/* Add Account Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 flex items-center justify-center z-10"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", stiffness: 120, damping: 14 }}
                className="bg-zinc-900 border border-zinc-700 p-6 rounded-xl shadow-lg w-96"
              >
                <h3 className="text-lg font-semibold mb-4 text-center">
                  Create New Account
                </h3>
                <label className="block text-sm mb-1 text-indigo-300">
                  Account Name
                </label>
                <input
                  type="text"
                  value={newAccount.name}
                  onChange={(e) =>
                    setNewAccount({ ...newAccount, name: e.target.value })
                  }
                  className="w-full mb-3 p-2 bg-zinc-800 border border-zinc-700 rounded-md text-white outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <label className="block text-sm mb-1 text-indigo-300">
                  Account Type
                </label>
                <select
                  value={newAccount.type}
                  onChange={(e) =>
                    setNewAccount({ ...newAccount, type: e.target.value })
                  }
                  className="w-full mb-4 p-2 bg-zinc-800 border border-zinc-700 rounded-md text-white outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="single">Single Asset</option>
                  <option value="multi">Multi Asset</option>
                </select>
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-3 py-1 bg-zinc-700 hover:bg-zinc-600 rounded-md text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={createAccount}
                    className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 rounded-md text-sm"
                  >
                    Create
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
