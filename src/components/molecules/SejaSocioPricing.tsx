import { AuthContext, ColorContext } from '@/contexts';
import { gql, useMutation, useQuery } from '@apollo/client';
import {
  Box,
  Button,
  Flex,
  Heading,
  List,
  ListIcon,
  ListItem,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  SimpleGrid,
  Stack,
  Text,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { ReactNode, useCallback, useContext, useState } from 'react';
import { CustomButton, CustomDivider } from '../atoms';

import client from '@/services/apollo-client';
import { useRouter } from 'next/router';
import { BsCurrencyDollar } from 'react-icons/bs';
import { HiCheckCircle } from 'react-icons/hi';
import { MdLogin } from 'react-icons/md';
import { Card } from '../templates';

const CHECKOUT_MEMBERSHIP = gql`
  mutation checkoutMembership($membershipId: ID!, $methodId: String!) {
    checkoutMembership(membershipId: $membershipId, methodId: $methodId) {
      checkoutUrl
    }
  }
`;

const PAYMENT_METHODS = gql`
  {
    allPaymentMethods {
      id
      title
      name
    }
  }
`;

interface SejaSocioPricingProps {
  children?: ReactNode;
}

type PaymentMethods = {
  allPaymentMethods: {
    id: string;
    title: string;
    name: string;
  }[];
};

type CheckoutMembership = {
  checkoutMembership: {
    checkoutUrl: string;
  };
};

export function SejaSocioPricing({}: SejaSocioPricingProps) {
  const router = useRouter();
  const toast = useToast();
  const { green, bg } = useContext(ColorContext);
  const { isAuthenticated, token, user } = useContext(AuthContext);
  const [billingPortalLoading, setBillingPortalLoading] = useState(false);
  const [mutateFunction, { loading }] =
    useMutation<CheckoutMembership>(CHECKOUT_MEMBERSHIP);
  const color = useColorModeValue('black', 'white');

  const { data } = useQuery<PaymentMethods>(PAYMENT_METHODS, {
    context: {
      headers: {
        authorization: `JWT ${token}`,
      },
    },
  });
  const planos = [
    {
      slug: 'mensal',
      nome: 'MENSAL',
      total: '29,90',
      valorMes: '***,**',
      descricao: 'Cobrado a cada mês.',
      features: [
        'Participe dos treinos de todas as modalidades e ensaios da Carabina',
        'Ganhe desconto em produtos e eventos',
      ],
      membershipId: 'TWVtYmVyc2hpcFBsYW5Ob2RlOjY=',
    },
    {
      slug: 'semestral',
      nome: 'SEMESTRAL',

      total: '119,40',
      valorMes: '***,**',
      descricao:
        'R$ 119,40 cobrado agora; depois, R$ 119,40 será cobrado a cada semestre após 6 meses.',
      best: true,
      features: [
        'TODOS OS BENEFÍCIOS DO SÓCIO FÚRIA',
        'Participe dos treinos de todas as modalidades e ensaios da Carabina',
        'Desconto em produtos e eventos organizados pela Fúria',
        'Desconto no INTERMED e no BONDE DO AHAM',
      ],
      membershipId: 'TWVtYmVyc2hpcFBsYW5Ob2RlOjc=',
    },
    {
      slug: 'anual',
      nome: 'ANUAL',
      total: '202,80',
      valorMes: '***,**',
      descricao:
        'R$ 202,80 cobrado agora; depois, 202,80 será cobrado anualmente após 12 meses.',
      features: [
        'TODOS OS BENEFÍCIOS DO SÓCIO FÚRIA',
        'Participe dos treinos de todas as modalidades e ensaios da Carabina',
        'Desconto em produtos e eventos organizados pela Fúria',
        'Desconto no INTERMED e no BONDE DO AHAM',
      ],
      membershipId: 'TWVtYmVyc2hpcFBsYW5Ob2RlOjE=',
    },
  ];

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
    toast({
      title: 'Sucesso',
      description: 'Solicitação iniciada. Aguardando pagamento',
      status: 'success',
      duration: 2500,
      isClosable: true,
      position: 'top-left',
    });
    router.push(data.user.member.billingPortalUrl);
  }, [router, toast, token]);

  const handlePagar = useCallback(
    async (membershipId: string, methodId: string) => {
      mutateFunction({
        variables: {
          membershipId,
          methodId,
        },
        context: {
          headers: {
            authorization: `JWT ${token}`,
          },
        },
      }).then(({ data }) => {
        router.push(data?.checkoutMembership.checkoutUrl as string);
      });
    },
    [mutateFunction, router, token],
  );
  return (
    <SimpleGrid
      columns={{ base: 1, lg: 3 }}
      spacing={{ base: '8', lg: '2' }}
      maxW="7xl"
      mx="auto"
      justifyItems="center"
      alignItems="center"
    >
      {planos.map((plano) => {
        return (
          <Card
            key={plano.nome}
            bg={bg}
            w="100%"
            h="100%"
            position="relative"
            overflow="hidden"
          >
            {plano.best && (
              <Flex
                bg="green.200"
                position="absolute"
                right={-20}
                top={6}
                width="240px"
                transform="rotate(45deg)"
                shadow={'base'}
                py={2}
                justifyContent="center"
                alignItems="center"
              >
                <Text
                  fontSize="xs"
                  textTransform="uppercase"
                  fontWeight="bold"
                  letterSpacing="wider"
                  color="gray.800"
                >
                  + Popular
                </Text>
              </Flex>
            )}
            <Stack spacing={4} h="100%" justify={'space-between'}>
              <Stack spacing={4}>
                <Box>
                  <Heading as="h3" size="lg">
                    {plano.nome}
                  </Heading>
                  <CustomDivider />
                </Box>

                <Text fontSize="4xl" fontWeight="extrabold" color={green}>
                  R$ {plano.total}
                </Text>
                <List spacing="4" mx="auto">
                  {plano.features.map((feature, index) => (
                    <ListItem fontWeight="medium" key={index}>
                      <ListIcon
                        fontSize="xl"
                        as={HiCheckCircle}
                        marginEnd={2}
                        color={green}
                      />
                      {feature}
                    </ListItem>
                  ))}
                </List>
              </Stack>
              <Popover placement="top">
                <Stack>
                  <Text textAlign="center" as="em">
                    Assine agora e aproveite 5% de desconto na{' '}
                    <strong>primeira associação</strong>!
                  </Text>
                  {/* <Text textAlign="center" fontSize="xs" fontStyle={'italic'}>
                    {plano.descricao}
                  </Text> */}
                  <PopoverTrigger>
                    <Button
                      colorScheme="green"
                      w="full"
                      p={4}
                      rounded="full"
                      _focus={{
                        outlineColor: green,
                        outlineWidth: 'thin',
                      }}
                      variant={'solid'}
                    >
                      Seja Sócio!
                    </Button>
                  </PopoverTrigger>
                </Stack>
                <Portal>
                  <PopoverContent bg={bg} _focus={{}}>
                    <PopoverArrow />
                    <PopoverHeader>
                      <Text fontSize="lg" fontWeight="extrabold" mb={2}>
                        R${plano.total}
                        <Text
                          fontSize="lg"
                          fontWeight="light"
                          as="i"
                          color={color}
                        >
                          /{plano.slug}
                        </Text>
                      </Text>
                    </PopoverHeader>
                    <PopoverCloseButton />
                    <PopoverBody>
                      <Flex flexGrow={1} justify="space-around" align="center">
                        {!isAuthenticated ? (
                          <Button
                            colorScheme="green"
                            leftIcon={<MdLogin />}
                            onClick={() =>
                              router.push('/login?after=/#seja-socio')
                            }
                          >
                            Entrar
                          </Button>
                        ) : user?.member.hasActiveMembership ? (
                          <Button
                            colorScheme="green"
                            onClick={handleBillingPortal}
                            isLoading={billingPortalLoading}
                            leftIcon={<BsCurrencyDollar />}
                          >
                            Gerenciar
                          </Button>
                        ) : (
                          <Stack>
                            {data?.allPaymentMethods?.map(
                              (method) =>
                                method.title !== 'PS' && (
                                  <CustomButton
                                    key={method.id}
                                    leftIcon={<BsCurrencyDollar />}
                                    isDisabled={!isAuthenticated}
                                    onClick={() =>
                                      handlePagar(plano.membershipId, method.id)
                                    }
                                    isLoading={loading}
                                  >
                                    {method.name}
                                  </CustomButton>
                                ),
                            )}
                          </Stack>
                        )}
                      </Flex>
                    </PopoverBody>
                    {!isAuthenticated && (
                      <PopoverFooter>
                        <Text as="i" fontSize="sm" color="gray.500">
                          *É necessario estar logado na plataforma.
                        </Text>
                      </PopoverFooter>
                    )}
                  </PopoverContent>
                </Portal>
              </Popover>
            </Stack>
          </Card>
        );
      })}
    </SimpleGrid>
  );
}
