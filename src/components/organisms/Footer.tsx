import { Box, HStack, Stack, Text } from '@chakra-ui/react';
import { CustomButton, CustomLink, HeaderImage, SocialIcons } from '../atoms';
import { ReactNode, useContext } from 'react';

import { ColorContext } from '@/contexts';
import NextImage from 'next/image';
import { useRouter } from 'next/router';

interface FooterProps {
  children?: ReactNode;
}

export function Footer({}: FooterProps) {
  const router = useRouter();
  const { green, bg } = useContext(ColorContext);
  return (
    <Box as="footer" role={'contentinfo'} bg={green}>
      <HStack
        py={4}
        w="full"
        maxW="8xl"
        mx="auto"
        justify={'space-between'}
        px={{ base: '4', lg: '8' }}
      >
        <Stack>
          <HeaderImage />
          <Text letterSpacing={2} textColor={bg}>
            &copy; 2022 |{' '}
            <CustomLink
              href="/"
              chakraLinkProps={{
                fontFamily: 'heading',
                _hover: {
                  color: green,
                },
              }}
            >
              A.A.A. FÚRIA
            </CustomLink>
          </Text>

          <CustomButton
            aria-label="designer"
            variant={'solid'}
            size={'xs'}
            rightIcon={
              <Box boxSize="20px" position="relative">
                <NextImage src={'/myLogo.png'} alt="myLogo" layout="fill" />
              </Box>
            }
            onClick={() => router.push('https://github.com/leonunesbs')}
          >
            Designed by
          </CustomButton>
        </Stack>
        <SocialIcons variant="solid" />
      </HStack>
    </Box>
  );
}
