import { Card, Layout } from '@/components/templates';
import { Center, Stack } from '@chakra-ui/react';
import { CustomButton, PageHeading, SocialIcons } from '@/components/atoms';

import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  return (
    <Layout
      title="linkTree | @aaafuria"
      py={0}
      pb={10}
      isHeaded={false}
      isFooted={false}
      bg="linear-gradient(140deg, #a3c925 25%, #0b4d0d 100%)"
      h="100vh"
    >
      <Stack h="100%" justify={'space-between'} pt={60}>
        <Center maxW="8xl">
          <Card w="full">
            <PageHeading>A.A.A. Fúria</PageHeading>
            <Stack>
              <CustomButton variant={'solid'} onClick={() => router.push('')}>
                Regulamento INTERCALOUROS
              </CustomButton>
              <CustomButton variant={'solid'} onClick={() => router.push('')}>
                Inscrições Comissão Workshop
              </CustomButton>
              <CustomButton variant={'solid'} onClick={() => router.push('')}>
                Site A.A.A. Fúria
              </CustomButton>
            </Stack>
          </Card>
        </Center>
        <SocialIcons
          iconButtonProps={{ variant: 'solid', bgColor: 'transparent' }}
        />
      </Stack>
    </Layout>
  );
}
