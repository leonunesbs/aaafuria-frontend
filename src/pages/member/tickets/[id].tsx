import {
  AspectRatio,
  Badge,
  Box,
  Center,
  HStack,
  Heading,
  Icon,
  Image,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tr,
  chakra,
  useBreakpointValue,
  useDimensions,
} from '@chakra-ui/react';
import {
  CustomButton,
  CustomIconButton,
  PageHeading,
  PreviousButton,
  TicketCircles,
} from '@/components/atoms';
import { HiCheckCircle, HiXCircle } from 'react-icons/hi';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useContext, useEffect, useRef, useState } from 'react';

import { AuthContext } from '@/contexts/AuthContext';
import { Card } from '@/components/templates';
import { FaWhatsapp } from 'react-icons/fa';
import { GetServerSideProps } from 'next';
import { Layout } from '@/components/templates/Layout';
import NextImage from 'next/image';
import QRCode from 'react-qr-code';
import { parseCookies } from 'nookies';
import { useRouter } from 'next/router';

const GET_TICKET = gql`
  query getTicket($id: ID) {
    ticket(id: $id) {
      id
      title
      remainingUses
      image
      createdAt
      updatedAt
      cart {
        user {
          member {
            name
            registration
            hasActiveMembership
            group
            whatsappUrl
          }
        }
      }
    }
  }
`;

const USE_TICKET = gql`
  mutation useTicket($ticketId: ID!) {
    useTicket(ticketId: $ticketId) {
      ok
    }
  }
`;

type TicketData = {
  ticket: {
    id: string;
    title: string;
    remainingUses: number;
    image: string;
    cart: {
      user: {
        member: {
          name: string;
          registration: string;
          hasActiveMembership: boolean;
          group: string;
          whatsappUrl: string;
        };
      };
    };
  };
};

type UseTicketData = {
  useTicket: {
    ok: boolean;
  };
};

export default function Ticket() {
  const router = useRouter();
  const contentRef = useRef<HTMLDivElement>(null);
  const dimensions = useDimensions(contentRef);
  const circleSize = useBreakpointValue([175, 220]);

  const ChakraNextImage = chakra(NextImage);
  const { id } = router.query;
  const { token, user } = useContext(AuthContext);
  const [uQRl, setUQRl] = useState('');
  const { data, refetch } = useQuery<TicketData>(GET_TICKET, {
    context: {
      headers: {
        authorization: `JWT ${token || ' '}`,
      },
    },
    variables: {
      id,
    },
  });
  const [handleTicket, { loading: handleTicketLoading }] =
    useMutation<UseTicketData>(USE_TICKET, {
      context: {
        headers: {
          authorization: `JWT ${token || ' '}`,
        },
      },
      variables: {
        ticketId: {
          id,
        },
      },
    });

  useEffect(() => {
    setUQRl(
      `http://${window.location.hostname}${
        window.location.port && window.location.port + ':'
      }${router.asPath}`,
    );
  }, [router.asPath]);

  return (
    <Layout title="Ingresso" isHeaded={false} isFooted={false}>
      <Box ref={contentRef} maxW="xl" mx="auto">
        <Card borderRadius={0} position={'relative'} mb={6}>
          <TicketCircles
            parentDimensions={dimensions}
            circleSize={circleSize as number}
          />

          <Box
            borderColor="green.200"
            borderStyle={'dashed'}
            borderWidth={2}
            minH="40vh"
            py={4}
            px={2}
            my={`${(circleSize as number) / 2}px`}
          >
            <Center mb={4}>
              <AspectRatio ratio={1} boxSize={'3xs'}>
                <Image
                  rounded={'xl'}
                  objectFit="cover"
                  src={data?.ticket?.image}
                  alt={data?.ticket?.title}
                  mx="auto"
                  draggable={false}
                />
              </AspectRatio>
            </Center>
            <PageHeading size="md">{data?.ticket?.title}</PageHeading>
            <Box>
              <Heading size="xs" my={4}>
                DADOS DO CLIENTE
              </Heading>
              <TableContainer>
                <Table size="sm">
                  <Tbody>
                    <Tr>
                      <Td>
                        <Text>Nome:</Text>
                      </Td>
                      <Td isNumeric>
                        <Text>{data?.ticket?.cart.user.member.name}</Text>
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>
                        <Text>Matrícula:</Text>
                      </Td>
                      <Td isNumeric>
                        <Text>
                          {data?.ticket?.cart.user.member.registration}
                        </Text>
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>
                        <Text>Turma:</Text>
                      </Td>
                      <Td isNumeric>
                        <Text>{data?.ticket?.cart.user.member.group}</Text>
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>
                        <Text>Associação:</Text>
                      </Td>
                      <Td isNumeric>
                        <Text>
                          {data?.ticket?.cart.user.member
                            .hasActiveMembership ? (
                            <Badge colorScheme="green">Sócio Ativo</Badge>
                          ) : (
                            <Badge colorScheme="red">Sócio Inativo</Badge>
                          )}
                        </Text>
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>
                        <Text>Contato:</Text>
                      </Td>
                      <Td>
                        <HStack w="full" justify={'flex-end'}>
                          <CustomIconButton
                            aria-label="whatsapp"
                            icon={<FaWhatsapp size="20px" />}
                            size="xs"
                            onClick={() =>
                              window.open(
                                data?.ticket?.cart.user.member
                                  .whatsappUrl as string,
                                '_ blank',
                              )
                            }
                          />
                        </HStack>
                      </Td>
                    </Tr>
                  </Tbody>
                </Table>
              </TableContainer>
            </Box>
            <Box>
              <Heading size="xs" my={4}>
                DADOS DO INGRESSO
              </Heading>
              <TableContainer mb={4}>
                <Table size="sm">
                  <Tbody>
                    <Tr>
                      <Td>
                        <Text>Usos restantes:</Text>
                      </Td>
                      <Td isNumeric>
                        <Text>{data?.ticket?.remainingUses}</Text>
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>
                        <Text>Válido:</Text>
                      </Td>
                      <Td isNumeric>
                        <Text>
                          {data?.ticket && data?.ticket.remainingUses > 0 ? (
                            <Icon as={HiCheckCircle} color="green.200" />
                          ) : (
                            <Icon as={HiXCircle} color="red.200" />
                          )}
                        </Text>
                      </Td>
                    </Tr>
                  </Tbody>
                </Table>
              </TableContainer>
              <Stack align={'center'} spacing={4}>
                <QRCode
                  value={uQRl}
                  size={128}
                  fgColor={
                    data?.ticket && data.ticket.remainingUses > 0
                      ? '#9aca3c'
                      : '#FC8181'
                  }
                  bgColor="transparent"
                />
                <Box
                  height={['40px', '50px']}
                  width={['65px', '80px']}
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
                    draggable={false}
                    filter="drop-shadow(0.12rem 0.15rem 0.15rem rgba(0, 0, 0, 0.1))"
                  />
                </Box>
              </Stack>
            </Box>
          </Box>
        </Card>
        <Stack>
          {user?.isStaff && data?.ticket && data.ticket.remainingUses > 0 && (
            <CustomButton
              variant={'solid'}
              isLoading={handleTicketLoading}
              onClick={async () => {
                await handleTicket({
                  variables: {
                    ticketId: data?.ticket.id,
                  },
                });
                refetch();
              }}
            >
              Usar
            </CustomButton>
          )}
          <PreviousButton href="/member/tickets" />
        </Stack>
      </Box>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ['aaafuriaToken']: token } = parseCookies(ctx);

  if (!token) {
    return {
      redirect: {
        destination: `/entrar?after=${ctx.resolvedUrl}`,
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
