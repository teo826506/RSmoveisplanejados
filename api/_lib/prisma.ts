import { PrismaClient } from '@prisma/client';

let prismaInstance: any = null;
let isDisabled = false;

export function getPrisma(): any {
  if (isDisabled) return null;
  if (prismaInstance) return prismaInstance;

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl || dbUrl.includes('placeholder')) {
    console.warn('DATABASE_URL is not defined or is a placeholder. Prisma will be disabled.');
    isDisabled = true;
    return null;
  }

  try {
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

export function withTimeout<T = any>(promise: Promise<T>, ms: number = 2500): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Operação no banco de dados excedeu o limite de tempo (${ms}ms)`));
    }, ms);
    promise
      .then((res) => {
        clearTimeout(timer);
        resolve(res);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

export function extractYouTubeId(url: string): string {
  if (!url) return '';
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? match[1] : '';
}
