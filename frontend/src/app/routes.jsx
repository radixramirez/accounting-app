import React from "react";
import { Route, Routes } from "react-router-dom";

import AccountsPage from "../features/accounts/pages/AccountsPage";
import AccountDetail from "../features/accounts/pages/AccountDetail";
import TransactionsPage from "../features/transactions/pages/TransactionsPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AccountsPage />} />
      <Route path="/account/:index" element={<AccountDetail />} />
      <Route path="/transactions" element={<TransactionsPage />} />
    </Routes>
  );
}
