import { Box, Divider, Stack } from '@chakra-ui/react';
import { Card, Layout } from '@/components/templates';
import { CustomButton, PageHeading, PreviousButton } from '@/components/atoms';
import {
  FaDrum,
  FaTicketAlt,
  FaVolleyballBall,
  FaWallet,
} from 'react-icons/fa';
import { useCallback, useContext, useState } from 'react';

import { AiFillIdcard } from 'react-icons/ai';
import { AuthContext } from '@/contexts';
import { GetServerSideProps } from 'next';
import { MdManageAccounts } from 'react-icons/md';
import client from '@/services/apollo-client';
import { gql } from '@apollo/client';
import { parseCookies } from 'nookies';
import { useRouter } from 'next/router';

function Dashboard() {
  const router = useRouter();
  const [billingPortalLoading, setBillingPortalLoading] = useState(false);
  const { token } = useContext(AuthContext);

  const handleBillingPortal = useCallback(async () => {
    setBillingPortalLoading(true);
    const { data, errors, loading } = await client.query({
      query: gql`
        query getUser {
          user {
            member {
              billingPortalUrl
            }
          }
        }
      `,
      context: {
        headers: {
          Authorization: `JWT ${token}`,
        },
      },
    });
    if (errors) {
      setBillingPortalLoading(loading);
      throw errors;
    }
    setBillingPortalLoading(loading);
    router.push(data.user.member.billingPortalUrl);
  }, [router, token]);
  return (
    <Layout title="Minha conta">
      <Box maxW="8xl" mx="auto">
        <PageHeading>Minha conta</PageHeading>
        <Card>
          <Stack>
            <CustomButton
              leftIcon={
                <>
                  <FaVolleyballBall size="20px" />
                  <Box ml={2} />
                  <FaDrum size="20px" />
                </>
              }
              onClick={() => router.push('/activities')}
            >
              Atividades
            </CustomButton>
            <CustomButton
              onClick={() => router.push('/member/my-identity')}
              leftIcon={<AiFillIdcard size="20px" />}
            >
              Carteirinha
            </CustomButton>

            <CustomButton
              leftIcon={<FaTicketAlt size="20px" />}
              onClick={() => router.push('/member/my-tickets')}
            >
              Meus ingressos
            </CustomButton>
            <CustomButton
              leftIcon={<FaWallet size="20px" />}
              onClick={() => router.push('/bank/my-payments')}
            >
              Pagamentos
            </CustomButton>
            <Divider height="15px" />

            <CustomButton
              leftIcon={<MdManageAccounts size="20px" />}
              colorScheme="yellow"
              isLoading={billingPortalLoading}
              onClick={handleBillingPortal}
            >
              Gerenciar associação
            </CustomButton>
            <PreviousButton href="/" />
          </Stack>
        </Card>
      </Box>
    </Layout>
  );
}
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ['aaafuriaToken']: token } = parseCookies(ctx);

  if (!token) {
    return {
      redirect: {
        destination: `/login?after=${ctx.resolvedUrl}`,
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default Dashboard;
