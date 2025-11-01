import { request } from "./client";

export async function getAccounts() {
  return request("/accounts/", {}, "Failed to fetch accounts");
}

export async function createAccount(data) {
  return request(
    "/accounts/",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    },
    "Failed to create account"
  );
}

export async function deleteAccount(id) {
  return request(
    `/accounts/${id}`,
    {
      method: "DELETE",
    },
    "Failed to delete account"
  );
}
