import { createRequire } from 'module';

let prismaInstance: any = null;
let isDisabled = false;

export function getPrisma(): any {
  if (isDisabled) return null;
  if (prismaInstance) return prismaInstance;

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl || dbUrl.includes('placeholder')) {
    isDisabled = true;
    return null;
  }

  try {
    const customRequire = createRequire(import.meta.url);
    const { PrismaClient } = customRequire('@prisma/client');
    prismaInstance = new PrismaClient({
      log: ['error']
    });
    return prismaInstance;
  } catch (e) {
    console.error('Prisma initialization failed, falling back to embedded data:', e);
    isDisabled = true;
    return null;
  }
}

export function extractYouTubeId(url: string): string {
  if (!url) return '';
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? match[1] : '';
}
