const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5050";

const buildUrl = (path) => `${API_BASE_URL}${path}`;

const readJson = async (response) => {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch (error) {
    return null;
  }
};

const handleResponse = async (response) => {
  const data = await readJson(response);
  if (!response.ok) {
    const message = data?.error || `Request failed (${response.status})`;
    throw new Error(message);
  }
  return data;
};

export const fetchTenders = async () => {
  const response = await fetch(buildUrl("/api/tenders"));
  return handleResponse(response);
};

export const createTender = async (payload) => {
  const response = await fetch(buildUrl("/api/tenders"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse(response);
};

export const updateTender = async (id, payload) => {
  const response = await fetch(buildUrl(`/api/tenders/${encodeURIComponent(id)}`), {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse(response);
};

export const deleteTender = async (id) => {
  const response = await fetch(buildUrl(`/api/tenders/${encodeURIComponent(id)}`), {
    method: "DELETE",
  });
  return handleResponse(response);
};
