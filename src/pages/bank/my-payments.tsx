import { CustomButton, PageHeading, PreviousButton } from '@/components/atoms';
import { gql, useQuery } from '@apollo/client';
import {
  Badge,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';

import { Card } from '@/components/templates';
import { Layout } from '@/components/templates/Layout';
import { AuthContext } from '@/contexts/AuthContext';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { parseCookies } from 'nookies';
import { useContext } from 'react';
import { IoMdEye } from 'react-icons/io';

const MY_PAYMENTS = gql`
  query MyPayments {
    myPayments {
      edges {
        node {
          id
          amount
          currency
          description
          createdAt
          status
        }
      }
    }
  }
`;

type MyPaymentsData = {
  myPayments: {
    edges: {
      node: {
        id: string;
        amount: number;
        currency: string;
        description: string;
        createdAt: string;
        status: string;
      };
    }[];
  };
};

function MyPayments() {
  const router = useRouter();
  const { token } = useContext(AuthContext);
  const { data } = useQuery<MyPaymentsData>(MY_PAYMENTS, {
    context: {
      headers: {
        Authorization: `JWT ${token}`,
      },
    },
  });

  return (
    <Layout title="Meus pagamentos">
      <PageHeading>Meus pagamentos</PageHeading>
      <Card>
        <TableContainer>
          <Table size={'sm'}>
            <Thead>
              <Tr>
                <Th />
                <Th>Descrição</Th>
                <Th>Valor</Th>
                <Th>Criado em</Th>
                <Th>Status</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data?.myPayments?.edges?.map(({ node }) => (
                <Tr key={node.id}>
                  <Td>
                    <CustomButton
                      leftIcon={<IoMdEye size="20px" />}
                      aria-label="ver mais"
                      onClick={() => router.push(`/bank/payments/${node.id}`)}
                      size="sm"
                      variant={'ghost'}
                    >
                      Ver
                    </CustomButton>
                  </Td>
                  <Td>{node.description}</Td>
                  <Td>
                    {node.amount} {node.currency}
                  </Td>
                  <Td>
                    <Text as={'time'} dateTime={node.createdAt}>
                      {new Date(node.createdAt).toLocaleString('pt-BR', {
                        timeStyle: 'short',
                        dateStyle: 'short',
                        timeZone: 'America/Sao_Paulo',
                      })}
                    </Text>
                  </Td>
                  <Td>
                    <Text>
                      <Badge
                        variant={'solid'}
                        colorScheme={node.status === 'PAGO' ? 'green' : 'gray'}
                      >
                        {node.status}
                      </Badge>
                    </Text>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Card>
      <PreviousButton href="/member/dashboard" />
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
    props: {
      token,
    },
  };
};

export default MyPayments;
