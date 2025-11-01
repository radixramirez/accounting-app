import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AccountsPage from "./pages/AccountsPage";
import AccountDetail from "./pages/AccountDetail";
import TransactionsPage from "./pages/TransactionsPage";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-gray-900 to-indigo-950 text-white">
        {/* --- Navigation Bar --- */}
        <nav className="bg-white/10 backdrop-blur-lg border-b border-white/10 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
            <h1 className="text-xl font-bold text-indigo-300 tracking-tight">
              Finance Ledger
            </h1>

            <div className="flex items-center space-x-6">
              <Link
                to="/"
                className="text-gray-300 hover:text-indigo-300 transition-colors font-medium"
              >
                Accounts
              </Link>
              <Link
                to="/transactions"
                className="text-gray-300 hover:text-indigo-300 transition-colors font-medium"
              >
                Transactions
              </Link>
            </div>
          </div>
        </nav>

        {/* --- Page Content --- */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<AccountsPage />} />
            <Route path="/account/:index" element={<AccountDetail />} />
            <Route path="/transactions" element={<TransactionsPage />} />
          </Routes>
        </main>

        {/* --- Footer --- */}
        <footer className="bg-white/5 border-t border-white/10 text-center py-4 text-sm text-gray-400">
          <p>
            © {new Date().getFullYear()} Finance Ledger — Local portfolio and
            cash flow tracker
          </p>
        </footer>
      </div>
    </Router>
  );
}
