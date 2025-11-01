const BASE_URL = "http://127.0.0.1:8000";

export const api = {
  // ─── ACCOUNTS ─────────────────────────────
  getAccounts: async () => {
    const res = await fetch(`${BASE_URL}/accounts/`);
    if (!res.ok) throw new Error("Failed to fetch accounts");
    return res.json();
  },

  createAccount: async (data) => {
    const res = await fetch(`${BASE_URL}/accounts/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create account");
    return res.json();
  },

  deleteAccount: async (id) => {
    const res = await fetch(`${BASE_URL}/accounts/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete account");
    return res.json();
  },

  // ─── BALANCES ─────────────────────────────
  getBalances: async () => {
    const res = await fetch(`${BASE_URL}/balances/`);
    if (!res.ok) throw new Error("Failed to fetch balances");
    return res.json();
  },

  // Overwrites or creates new balance
  addBalance: async (data) => {
    const res = await fetch(`${BASE_URL}/balances/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to add/update balance");
    return res.json();
  },

  // NEW: Adds external funds (increases balance)
  addExternalFunds: async (data) => {
    const res = await fetch(`${BASE_URL}/balances/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to add external funds");
    return res.json();
  },

  // ─── TRANSACTIONS ─────────────────────────
  getTransactions: async () => {
    const res = await fetch(`${BASE_URL}/transactions/`);
    if (!res.ok) throw new Error("Failed to fetch transactions");
    return res.json();
  },

  createTransaction: async (data) => {
    const res = await fetch(`${BASE_URL}/transactions/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create transaction");
    return res.json();
  },
};
