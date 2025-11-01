import React from "react";
import { Link } from "react-router-dom";

import AppProviders from "./AppProviders";
import AppRoutes from "./routes";

export default function App() {
  return (
    <AppProviders>
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
          <AppRoutes />
        </main>

        {/* --- Footer --- */}
        <footer className="bg-white/5 border-t border-white/10 text-center py-4 text-sm text-gray-400">
          <p>
            © {new Date().getFullYear()} Finance Ledger — Local portfolio and cash flow tracker
          </p>
        </footer>
      </div>
    </AppProviders>
  );
}
