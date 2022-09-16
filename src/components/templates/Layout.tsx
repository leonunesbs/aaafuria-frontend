import { Box, BoxProps, Flex } from '@chakra-ui/react';
import { Footer, Header } from '../organisms';
import { ReactNode, useContext } from 'react';

import { ColorContext } from '@/contexts';
import Head from 'next/head';
import { useRouter } from 'next/router';

interface LayoutProps extends BoxProps {
  children: ReactNode;
  title: string;
  description?: string;
  keywords?: string;
  isHeaded?: boolean;
  isFooted?: boolean;
}

export function Layout({
  children,
  title,
  description,
  keywords,
  isHeaded = true,
  isFooted = true,
  ...rest
}: LayoutProps) {
  const router = useRouter();
  const { green } = useContext(ColorContext);

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <title>{title ? `${title} | @aaafuria` : '@aaafuria'}</title>
        <meta
          name="description"
          content={
            description
              ? `${description}`
              : 'Plataforma de sócios e loja da Associação Atlética de Medicina Fúria Uniniovafapi. Seja sócio da Maior do Piauí e aproveite dos nossos produtos, treinos, ensaios, eventos e mais...'
          }
        />
        <meta
          name="keywords"
          content={`aaafuria, site, atlética, fúria, medicina, loja, eventos, intermed, ${keywords}`}
        />
        <link rel="canonical" href={`https://aaafuria.site${router.asPath}`} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content={`https://aaafuria.site${router.asPath}`}
        />
        <meta
          property="og:title"
          content={title ? `@aaafuria | ${title}` : '@aaafuria'}
        />
        <meta
          property="og:description"
          content={
            description
              ? `${description}`
              : 'Plataforma de sócios e loja da Associação Atlética de Medicina Fúria Uniniovafapi. Seja sócio da Maior do Piauí e aproveite dos nossos produtos, treinos, ensaios, eventos e mais...'
          }
        />
        <meta property="og:image" content={'/logo-aaafuria.png'} />
        <meta property="og:image:alt" content="logo" />
        <meta property="og:locale" content="pt_BR" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:url"
          content={`https://aaafuria.site${router.asPath}`}
        />
        <meta
          property="twitter:title"
          content={title ? `@aaafuria | ${title}` : '@aaafuria'}
        />
        <meta
          property="twitter:description"
          content={
            description
              ? `${description}`
              : 'Plataforma de sócios e loja da Associação Atlética de Medicina Fúria Uniniovafapi. Seja sócio da Maior do Piauí e aproveite dos nossos produtos, treinos, ensaios, eventos e mais...'
          }
        />
        <meta property="twitter:image" content={'/logo-aaafuria.png'} />
        <meta name="twitter:image:alt" content="logo" />
      </Head>
      {isHeaded && <Header />}
      <Flex flexGrow={1} bgColor={green} h={'0.5'} />
      <Box minH="100vh" py="10" px={['2', '10']} maxW="8xl" mx="auto" {...rest}>
        {children}
      </Box>
      {isFooted && <Footer />}
    </>
  );
}
