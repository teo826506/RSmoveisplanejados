import { PrismaClient } from '@prisma/client';

let prismaInstance: PrismaClient | null = null;
let initAttempted = false;

export function getPrisma(): PrismaClient | null {
  const dbUrl = process.env.DATABASE_URL;
  // Only connect if we have a real remote DATABASE_URL
  if (!dbUrl || dbUrl.includes('dummy') || dbUrl.includes('localhost') || dbUrl.includes('127.0.0.1')) {
    return null;
  }
  if (initAttempted && !prismaInstance) return null;
  try {
    if (!prismaInstance) {
      initAttempted = true;
      prismaInstance = new PrismaClient();
    }
    return prismaInstance;
  } catch (err) {
    console.error('Failed to initialize Prisma Client:', err);
    initAttempted = true;
    return null;
  }
}

export function extractYouTubeId(url: string): string {
  if (!url) return '';
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? match[1] : '';
}
