// Which frontend URLs are allowed to call this API

const DEFAULT_DEV_ORIGINS = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
];

export function getAllowedOrigins() {
  const fromEnv = (process.env.CORS_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  const frontendUrl = process.env.FRONTEND_URL?.trim();

  const origins =
    fromEnv.length > 0
      ? fromEnv
      : frontendUrl
        ? [frontendUrl, ...DEFAULT_DEV_ORIGINS]
        : DEFAULT_DEV_ORIGINS;

  if (frontendUrl && !origins.includes(frontendUrl)) {
    origins.push(frontendUrl);
  }

  return [...new Set(origins)];
}
