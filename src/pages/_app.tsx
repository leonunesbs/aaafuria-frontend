import * as gtag from 'libs/gtag';

import { AuthProvider, ColorProvider } from '@/contexts';
import { ReactNode, useEffect } from 'react';

import { Analytics } from '@/components/atoms/Analytics';
import { ApolloProvider } from '@apollo/client';
import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import { Fonts } from '@/components/atoms';
import client from '@/services/apollo-client';
import { hotjar } from 'react-hotjar';
import theme from '@/styles/theme';
import { useRouter } from 'next/router';

const ContextProviders = ({ children }: { children: ReactNode }) => {
  return (
    <AuthProvider>
      <ColorProvider>{children}</ColorProvider>
    </AuthProvider>
  );
};

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  useEffect(() => {
    if (process.env.NODE_ENV == 'production') {
      hotjar.initialize(2942033, 6);

      const handleRouteChange = (url: URL) => {
        gtag.pageview(url);
      };
      router.events.on('routeChangeComplete', handleRouteChange);
      return () => {
        router.events.off('routeChangeComplete', handleRouteChange);
      };
    }
  }, [router.events]);
  return (
    <ApolloProvider client={client}>
      <ChakraProvider theme={theme}>
        <Fonts />
        <ContextProviders>
          <Component {...pageProps} />
        </ContextProviders>
        <Analytics />
      </ChakraProvider>
    </ApolloProvider>
  );
}
