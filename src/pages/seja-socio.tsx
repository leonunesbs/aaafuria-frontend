import { PageHeading, PreviousButton } from '@/components/atoms';
import { Text, useToast } from '@chakra-ui/react';
import { useContext, useEffect } from 'react';

import { AuthContext } from '@/contexts/AuthContext';
import { ColorContext } from '@/contexts/ColorContext';
import { Layout } from '@/components/templates';
import { SejaSocioPricing } from '@/components/molecules';
import { useRouter } from 'next/router';

function SejaSocio() {
  const router = useRouter();
  const { green } = useContext(ColorContext);
  const toast = useToast();

  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user?.member.hasActiveMembership) {
      toast({
        title: 'Você já é um sócio',
        status: 'info',
        duration: 2500,
        isClosable: true,
        position: 'top-left',
      });
      router.push('/areamembro');
    }
  }, [router, toast, user?.member.hasActiveMembership]);

  return (
    <Layout
      title="Seja Sócio"
      description="Junte-se à Fúria, escolha o plano de associação que melhor se encaixa com você! Aproveite agora o desconto na primeira associação seja Sócio e aproveite nossos treinos, ensaios, produtos, eventos e muito mais!"
    >
      <PageHeading>
        Junte-se à Fúria,{' '}
        <Text as="span" color={green}>
          Seja sócio
        </Text>
        !
      </PageHeading>
      <SejaSocioPricing />
      <PreviousButton href="/" />
    </Layout>
  );
}

export default SejaSocio;
