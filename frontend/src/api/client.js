// One place for all HTTP calls to the backend (base URL + /api).

import axios from "axios";
import API_URL from "../config.js";

export const api = axios.create({
  baseURL: `${API_URL}/api`,
});

// Add JWT to every request if user is logged in
api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // FormData needs the browser to set multipart boundary automatically
  if (config.data instanceof FormData && config.headers) {
    delete config.headers["Content-Type"];
  }

  return config;
});

let onAccountBlocked = null;

// AuthProvider sets this so blocked users get logged out automatically
export function setAccountBlockedHandler(handler) {
  onAccountBlocked = handler;
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message;
    if (
      error.response?.status === 403 &&
      typeof message === "string" &&
      message.includes("blocked")
    ) {
      onAccountBlocked?.();
    }
    return Promise.reject(error);
  },
);

export default api;
