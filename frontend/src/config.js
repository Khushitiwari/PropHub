// Backend server URL (used for Socket.io). REST calls use api/client.js instead.

export const API_URL =
  import.meta.env.VITE_API_URL || "https://prophub-lyjb.onrender.com";

export default API_URL;
