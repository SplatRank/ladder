import { ChakraProvider } from '@chakra-ui/react';
import { Provider } from 'next-auth/client';
import { AppProps } from 'next/app';
import { ReactNode } from 'react';

const App = ({ Component, pageProps }: AppProps): ReactNode => {
  return (
    <ChakraProvider>
      <Provider session={pageProps.session}>
        <Component {...pageProps} />
      </Provider>
    </ChakraProvider>
  );
};

export default App;
