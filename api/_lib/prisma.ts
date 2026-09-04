// Prisma is disabled in serverless environment (no DATABASE_URL on Vercel)
// All data comes from the embedded db-data.ts snapshot

export function getPrisma(): null {
  return null;
}

export function extractYouTubeId(url: string): string {
  if (!url) return '';
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? match[1] : '';
}
