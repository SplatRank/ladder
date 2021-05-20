// TODO: Replace this file with `next.config.ts` when Next.js supports it

/** @typedef {import("next/dist/next-server/server/config-shared").NextConfig} NextConfig */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const nextTranslate = require('next-translate');

/** @type {NextConfig} */
module.exports = {
  future: {
    webpack5: true,
  },
  ...nextTranslate(),
};
