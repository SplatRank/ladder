import { PrismaClient, Role } from '@prisma/client';

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

declare module 'next-auth' {
  export interface User {
    email?: string | null;
    image?: string | null;
    name?: string | null;
    role: Role;
  }

  export interface Session {
    user?: {
      email?: string | null;
      image?: string | null;
      name?: string | null;
      roles?: Role[];
    };
  }
}

declare module 'next-auth/jwt' {
  export interface JWT {
    roles?: Role[];
  }
}
