export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      TWITTER_BEARER_TOKEN: string;
    }
  }
}
