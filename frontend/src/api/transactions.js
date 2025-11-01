import { request } from "./client";

export async function getTransactions() {
  return request("/transactions/", {}, "Failed to fetch transactions");
}

export async function createTransaction(data) {
  return request(
    "/transactions/",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    },
    "Failed to create transaction"
  );
}
