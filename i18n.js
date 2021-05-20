module.exports = {
  defaultLocale: 'ja',
  loadLocaleFrom: (lang, ns) => import(`./locales/${lang}/${ns}.json`).then((m) => m.default),
  locales: ['ja'],
  pages: {
    '*': ['common'],
  },
};
