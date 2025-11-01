import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAccounts as fetchAccounts } from "../../../api/accounts";
import { getBalances as fetchBalances } from "../../../api/balances";

export default function AccountDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [account, setAccount] = useState(null);
  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch account + balances from backend
  useEffect(() => {
    const loadData = async () => {
      try {
        const allAccounts = await fetchAccounts();
        const foundAccount = allAccounts.find(
          (a) => String(a.id) === String(id)
        );

        if (!foundAccount) {
          setError("Account not found");
          setLoading(false);
          return;
        }

        setAccount(foundAccount);

        const allBalances = await fetchBalances();
        const accBalances = allBalances.filter(
          (b) => String(b.account_name) === foundAccount.name
        );

        setBalances(accBalances);
        setLoading(false);
      } catch (err) {
        console.error("Error loading account details:", err);
        setError("Failed to load account details");
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <p>Loading account details...</p>
      </div>
    );
  }

  if (error || !account) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white">
        <h2 className="text-2xl font-semibold mb-4">
          {error || "Account not found"}
        </h2>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-indigo-950 text-white p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            {account.name}
          </h1>
          <p className="text-indigo-300 capitalize">
            {account.type} asset account
          </p>
        </div>

        {/* Balances Table */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/10 shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4 text-indigo-300">
            Balances
          </h2>

          {balances.length === 0 ? (
            <p className="text-gray-400 text-sm">
              No balances found for this account.
            </p>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-sm text-indigo-300 border-b border-white/10">
                  <th className="py-2">Asset</th>
                  <th className="py-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {balances.map((b) => (
                  <tr
                    key={b.id}
                    className="border-b border-white/5 hover:bg-white/10 transition"
                  >
                    <td className="py-2 font-medium">{b.asset_symbol}</td>
                    <td className="py-2 text-right">
                      {Number(b.amount).toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Back Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-md font-medium transition"
          >
            ← Back
          </button>
        </div>
      </div>
    </div>
  );
}
