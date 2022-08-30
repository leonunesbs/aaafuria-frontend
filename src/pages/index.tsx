import { Box, Stack, chakra, useColorModeValue } from '@chakra-ui/react';
import { Card, Layout } from '@/components/templates';
import { CustomButton, PageHeading, SocialIcons } from '@/components/atoms';

import Image from 'next/image';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  const ctaLogo = useColorModeValue('/logo-branco.webp', '/logo-cinza.webp');
  const ChakraNextImage = chakra(Image);

  return (
    <Layout
      title="fúriaTree"
      description="Acesso rápido para links em alta!"
      py={0}
      pb={10}
      isHeaded={false}
      isFooted={false}
      bg="linear-gradient(140deg, #a3c925 5%, #0b4d0d 100%)"
      h="100vh"
    >
      <Stack h="100%" justify={'space-between'} pt={10}>
        <Stack align={'center'} spacing={6}>
          <Box boxSize={['2xs', 'xs', 'md']} position="relative">
            <ChakraNextImage
              placeholder="blur"
              blurDataURL={ctaLogo}
              layout="fill"
              objectFit="cover"
              src={ctaLogo}
              quality={20}
              alt="logo"
              mx="auto"
              draggable={false}
            />
          </Box>

          <Card w="full" maxW="xl">
            <PageHeading>A.A.A. Fúria</PageHeading>
            <Stack>
              <CustomButton
                variant={'solid'}
                onClick={() =>
                  router.push(
                    'https://drive.google.com/file/d/1chVEgUpkfUJfr-de0xQNM7r2KX3ceyq3/view?usp=sharing',
                  )
                }
                textTransform="uppercase"
              >
                Regulamento INTERCALOUROS
              </CustomButton>
              <CustomButton
                variant={'solid'}
                onClick={() =>
                  router.push(
                    'https://docs.google.com/forms/d/e/1FAIpQLSfu2GFiDtv1h_JrbD6kIAuB6k8a3oK-Zq__zCRJIiAefTvFRA/viewform?usp=sf_link',
                  )
                }
                textTransform="uppercase"
              >
                Inscrições Comissão Workshop
              </CustomButton>
              <CustomButton
                variant={'solid'}
                onClick={() => router.push('https://aaafuria.site')}
                textTransform="uppercase"
              >
                Site A.A.A. Fúria
              </CustomButton>
            </Stack>
          </Card>
        </Stack>

        <SocialIcons
          iconButtonProps={{ variant: 'solid', bgColor: 'transparent' }}
        />
      </Stack>
    </Layout>
  );
}
