// Turn axios errors into a short message for the UI

export function getApiErrorMessage(error, fallback = "Something went wrong") {
  if (error && typeof error === "object" && "response" in error) {
    const data = error.response?.data;
    if (data && typeof data.message === "string") return data.message;
    if (typeof data === "string") return data;
  }
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}
