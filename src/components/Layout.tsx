import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';
import React from 'react';

const Layout: React.FC = ({ children }) => {
  const { t } = useTranslation('common');

  return (
    <>
      <Head>
        <title>{t('app_name')}</title>
      </Head>
      <div className="layout">{children}</div>
    </>
  );
};

export default Layout;
