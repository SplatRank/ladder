/* eslint-disable no-restricted-imports */
import axios from 'axios';
import prisma from '../prisma';
import { Prisma, SocialType } from '.prisma/client';

const TWITTER_API_V2 = 'https://api.twitter.com/2/';
const createTwitterClient = (bearerToken: string) => {
  return async <T>(
    endpoint: string,
    { data, query }: { data?: Record<string, string>; query?: Record<string, string> },
  ) => {
    let url = `${TWITTER_API_V2}${endpoint}`;
    if (query) {
      const queryParams = Object.entries(query)
        .map(([key, value]) => `${key}=${value}`)
        .join('&');
      url += '?' + queryParams;
    }

    console.log(`Requesting ${url}`);

    const res = await axios.get<{ data: T; errors?: unknown[] }>(url, {
      data,
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    });

    return res.data;
  };
};

const error = (message: unknown) => {
  console.error(message);
  process.exit(1);
};

type UserObject = {
  id: string;
  name: string;
  public_metrics: {
    followers_count: number;
    following_count: number;
    listed_count: number;
    tweet_count: number;
  };
  username: string;
};

// Update Twitter follower table
const fetch = async () => {
  // TODO: Add support for more than 100 users
  const today = new Date();
  const twitterClient = createTwitterClient(process.env.TWITTER_BEARER_TOKEN);

  const fetchedAccounts = await prisma.socialFollower.findMany({ where: { date: today } });
  const accountsToFetch = await prisma.socialAccount.findMany({
    where: {
      id: { notIn: fetchedAccounts.map(({ socialAccountId }) => socialAccountId) },
    },
  });
  const idsToFetch = accountsToFetch.map(({ socialId }) => socialId);
  if (idsToFetch.length === 0) {
    error(`Follower counts are already up to date.`);
  }

  // TODO: https://github.com/prisma/prisma/issues/7395
  // const idRows = await prisma.$queryRaw<Array<{ social_account_id: bigint }>>(`
  // WITH fetched_ids AS (
  //   SELECT social_account_id
  //   FROM social_followers
  //   WHERE date = CURRENT_TIMESTAMP::date
  // )
  // SELECT social_account_id
  // FROM social_accounts
  // WHERE id NOT IN (
  //     SELECT *
  //     FROM fetched_ids
  //   )
  // `);
  // const ids = idRows.map(({ social_account_id: id }) => id);

  console.log(`Fetching Twitter followers for ${idsToFetch.length} user(s).`);
  const res = await twitterClient<UserObject[]>('users', {
    query: {
      ids: idsToFetch.join(','),
      'user.fields': 'public_metrics',
    },
  });
  if (res.errors) {
    error(res.errors);
  }

  const data = res.data.map<Prisma.SocialFollowerCreateManyInput>((account) => ({
    count: account.public_metrics.followers_count,
    date: today,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    socialAccountId: accountsToFetch.find(({ socialId }) => socialId.toString() === account.id)!.id,
  }));
  await prisma.socialFollower.createMany({ data });
};

// Register social account
const register = async (socialType: SocialType, ids: bigint[]) => {
  try {
    // To avoid unique constraint error, first check existence before inserting.
    const existIds = (
      await prisma.socialAccount.findMany({
        select: { socialId: true },
        where: {
          socialType,
          socialId: { in: ids },
        },
      })
    ).map(({ socialId }) => socialId);
    const idsToInsert = ids.filter((id) => !existIds.includes(id));
    if (idsToInsert.length === 0) {
      error('No new user to register.');
    } else if (existIds) {
      console.info(`Skipped registering ${existIds.length} user(s).`);
    }

    const data = idsToInsert.map<Prisma.SocialAccountCreateManyInput>((id) => ({
      socialType,
      socialId: id,
      userId: null,
    }));
    await prisma.socialAccount.createMany({ data });

    console.log(`Successfully registered ${data.length} user(s).`);
  } catch (e) {
    error(e);
  }
};

// Process command
(async () => {
  const [_, __, command, ...args] = process.argv;

  // Run 'fetch' command when command is not specified
  switch (command ?? 'fetch') {
    case 'fetch':
      await fetch();

      break;
    case 'register': {
      const [socialTypeStr, idsStr] = args;
      const socialTypes = {
        twitter: SocialType.Twitter,
        // TODO: Add support for YouTube
        // 'youtube': SocialType.YouTube,
      } as const;
      const socialType =
        socialTypes[socialTypeStr.toLowerCase() as keyof typeof socialTypes] ?? null;
      if (!socialType) {
        error(`No valid social type was specifide. Valid types are: ${Object.keys(socialTypes)}`);
      }

      const ids = idsStr.split(',').map(BigInt);
      await register(socialType, ids);

      break;
    }
    default:
      error('No valid command was specified.');
  }

  await prisma.$disconnect();
})();
