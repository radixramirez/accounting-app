import { request } from "./client";

export async function getBalances() {
  return request("/balances/", {}, "Failed to fetch balances");
}

export async function addBalance(data) {
  return request(
    "/balances/",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    },
    "Failed to add/update balance"
  );
}

export async function addExternalFunds(data) {
  return request(
    "/balances/add",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    },
    "Failed to add external funds"
  );
}
