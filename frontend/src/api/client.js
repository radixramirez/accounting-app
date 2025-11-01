const BASE_URL = "http://127.0.0.1:8000";

export async function request(path, options = {}, errorMessage = "Request failed") {
  const response = await fetch(`${BASE_URL}${path}`, options);
  if (!response.ok) {
    throw new Error(errorMessage);
  }
  return response.json();
}

export { BASE_URL };
