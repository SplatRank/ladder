import { useRadio } from '@chakra-ui/radio';
import { NextApiHandler } from 'next';
import NextAuth, { NextAuthOptions, User } from 'next-auth';
import { Prisma as PrismaAdapter } from 'next-auth/adapters';
import { JWT } from 'next-auth/jwt';
import Providers from 'next-auth/providers';
import prisma from '@/prisma';

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options);
export default authHandler;

const isUserType = (user: JWT | User): user is User => Boolean(user.role);

const options: NextAuthOptions = {
  providers: [
    Providers.Twitter({
      clientId: process.env.TWITTER_CLIENT_ID,
      clientSecret: process.env.TWITTER_CLIENT_SECRET,
    }),
  ],
  adapter: PrismaAdapter.Adapter({ prisma }),
  secret: process.env.SECRET,
  callbacks: {
    async jwt(token, user, _account, _profile, _isNewUser) {
      if (user) {
        token.roles = [user.role];
      }
      return token;
    },
    async session(session, user) {
      if (session.user) {
        if (isUserType(user)) {
          session.user.roles = [user.role];
        } else if (user) {
          session.user.roles = user.roles;
        }
      }

      return session;
    },
  },
};
