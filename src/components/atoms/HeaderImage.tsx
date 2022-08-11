import { Box, chakra } from '@chakra-ui/react';

import NextImage from 'next/image';
import { ReactNode } from 'react';
import { useRouter } from 'next/router';

interface HeaderImageProps {
  children?: ReactNode;
}

export function HeaderImage({}: HeaderImageProps) {
  const router = useRouter();
  const ChakraNextImage = chakra(NextImage);
  return (
    <Box
      height={['80px', '100px']}
      width={['130px', '160px']}
      position="relative"
      onClick={() => router.push('/')}
    >
      <ChakraNextImage
        placeholder="blur"
        layout="fill"
        objectFit="cover"
        src={'/logo-aaafuria-h.webp'}
        blurDataURL={'/logo-aaafuria-h.webp'}
        quality={1}
        alt="logo"
        mx="auto"
        mb={{ base: '8', md: '12' }}
        draggable={false}
        filter="drop-shadow(0.12rem 0.15rem 0.15rem rgba(0, 0, 0, 0.1))"
      />
    </Box>
  );
}
