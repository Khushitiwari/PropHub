/**
 * Normalizes axios/API errors into a user-facing message.
 * @param {unknown} error
 * @param {string} [fallback]
 */
export function getApiErrorMessage(error, fallback = "Something went wrong") {
  if (error && typeof error === "object" && "response" in error) {
    const data = error.response?.data;
    if (data && typeof data.message === "string") return data.message;
    if (typeof data === "string") return data;
  }
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}
