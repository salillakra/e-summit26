export function getSiteUrl(): URL {
  const raw = process.env.NEXT_PUBLIC_SITE_URL;
  if (raw) {
    try {
      return new URL(raw);
    } catch {
      console.warn(`Invalid NEXT_PUBLIC_SITE_URL: ${raw}. Falling back to default localhost URL.`);
    }
  }

  return new URL("http://localhost:3000");
}
