import { ChakraProvider } from '@chakra-ui/react';
import { Provider } from 'next-auth/client';
import { AppProps } from 'next/app';

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <ChakraProvider>
      <Provider session={pageProps.session}>
        <Component {...pageProps} />
      </Provider>
    </ChakraProvider>
  );
};

export default App;
