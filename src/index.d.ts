import { PrismaClient } from '@prisma/client';

declare global {
  namespace NodeJS {
    interface Global {
      prisma: PrismaClient;
    }

    interface ProcessEnv {
      TWITTER_CLIENT_ID: string;
      TWITTER_CLIENT_SECRET: string;
    }
  }
}
