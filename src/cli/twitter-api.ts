import axios from 'axios';
export type UserObject = {
  id: string;
  name: string;
  username: string;
};

export type UserObjectWithPublicMetrics = UserObject & {
  public_metrics: {
    followers_count: number;
    following_count: number;
    listed_count: number;
    tweet_count: number;
  };
};

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

export const twitterClient = createTwitterClient(process.env.TWITTER_BEARER_TOKEN);
