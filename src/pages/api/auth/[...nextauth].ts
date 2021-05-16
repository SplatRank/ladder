import { NextApiHandler } from 'next';
import NextAuth from 'next-auth';
import { Prisma as PrismaAdapter } from 'next-auth/adapters';
import Providers from 'next-auth/providers';
import prisma from '@/prisma';

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options);
export default authHandler;

const options = {
  providers: [
    Providers.Twitter({
      clientId: process.env.TWITTER_CLIENT_ID,
      clientSecret: process.env.TWITTER_CLIENT_SECRET,
    }),
  ],
  adapter: PrismaAdapter.Adapter({ prisma }),
  secret: process.env.SECRET,
};
