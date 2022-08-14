import { AuthContext, ColorContext } from '@/contexts';
import {
  Badge,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  SimpleGrid,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import {
  CustomButton,
  CustomIconButton,
  PageHeading,
} from '@/components/atoms';
import { MdSend, MdShoppingCart } from 'react-icons/md';
import { gql, useQuery } from '@apollo/client';
import { useCallback, useContext, useEffect, useState } from 'react';

import { GetStaticProps } from 'next';
import { Layout } from '@/components/templates';
import { PreviousButton } from '@/components/atoms';
import { ProductCard } from '@/components/molecules';
import client from '@/services/apollo-client';
import { useRouter } from 'next/router';

const ANALOG_ITEMS = gql`
  query getAnalogItems {
    analogItems {
      objects {
        id
        name
        price
        image
        description
        membershipExclusive
        membershipPrice
        hasDescription
        staffPrice
        variations {
          edges {
            node {
              id
              refItem {
                id
              }
              name
              isActive
              variations {
                edges {
                  node {
                    id
                    refItem {
                      id
                    }
                    name
                    isActive
                    variations {
                      edges {
                        node {
                          id
                          refItem {
                            id
                          }
                          name
                          isActive
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

const GET_MEMBER = gql`
  query ($registration: String) {
    memberByRegistration(registration: $registration) {
      id
      name
      hasActiveMembership
    }
  }
`;

export type ProductType = {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  membershipExclusive: boolean;
  membershipPrice: number;
  staffPrice: number;
  hasDescription: boolean;
  variations: {
    edges: {
      node: {
        id: string;
        refItem: {
          id: string;
        };
        name: string;
        isActive: boolean;
        variations: {
          edges: {
            node: {
              id: string;
              refItem: {
                id: string;
              };
              name: string;
              isActive: boolean;
              variations: {
                edges: {
                  node: {
                    id: string;
                    refItem: {
                      id: string;
                    };
                    name: string;
                    isActive: boolean;
                  };
                }[];
              };
            };
          }[];
        };
      };
    }[];
  };
};

interface PosProps {
  products: ProductType[];
}

function Pos({ products }: PosProps) {
  const router = useRouter();
  const toast = useToast();
  const { user, token } = useContext(AuthContext);
  const { green } = useContext(ColorContext);

  const [clientRegistration, setClientRegistration] = useState<string | null>(
    null,
  );

  const { handleSubmit, control } = useForm<{
    registration: string;
  }>();

  const {
    data: member,
    loading: loadingMember,
    refetch: refetchMember,
  } = useQuery<{
    memberByRegistration: {
      id: string;
      name: string;
      hasActiveMembership: boolean;
    };
  }>(GET_MEMBER, {
    context: {
      headers: {
        Authorization: token ? `JWT ${token}` : '',
      },
    },
  });

  const onSubmit: SubmitHandler<{ registration: string }> = useCallback(
    (data: { registration: string }) => {
      refetchMember({ registration: data.registration });
      setClientRegistration(data.registration);
    },
    [refetchMember],
  );

  useEffect(() => {
    if (user?.isStaff === false) {
      toast({
        title: 'Área restrita',
        description: 'Você não tem permissão para acessar esta área.',
        status: 'warning',
        duration: 2500,
        isClosable: true,
        position: 'top-left',
      });
      router.push('/');
    }
  }, [router, toast, user?.isStaff]);
  return (
    <Layout
      title="POS Fúria"
      description="Adquira os produtos mais bonitos do Nordeste."
      keywords="loja, eventos, produtos, fúria, piauí"
    >
      <Box>
        <PageHeading>Ponto de Serviço</PageHeading>

        {user?.isStaff && (
          <FormControl mb={4}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormLabel htmlFor="registration">
                <Text fontSize={'xs'}>
                  Cliente: {member?.memberByRegistration?.name}
                  {member?.memberByRegistration?.hasActiveMembership && (
                    <Badge colorScheme={'green'} ml={2}>
                      Sócio
                    </Badge>
                  )}
                </Text>
              </FormLabel>
              <InputGroup maxW="2xs" size={'sm'}>
                <Controller
                  name="registration"
                  control={control}
                  render={({ field }) => (
                    <Input
                      placeholder="Matrícula"
                      rounded="3xl"
                      focusBorderColor={green}
                      {...field}
                    />
                  )}
                />

                <InputRightElement>
                  <CustomIconButton
                    type="submit"
                    aria-label="set"
                    isLoading={loadingMember}
                    icon={<MdSend size="20px" />}
                  />
                </InputRightElement>
              </InputGroup>
            </form>
          </FormControl>
        )}
        <SimpleGrid
          columns={{ base: user?.isStaff ? 2 : 1, md: 3, lg: 3 }}
          gap={2}
        >
          {products.map((product) => {
            return (
              <ProductCard
                key={product.id}
                node={product}
                clientRegistration={clientRegistration}
              />
            );
          })}
        </SimpleGrid>
        {products.length === 0 && (
          <Text textAlign={'center'}>
            <em>Nenhum produto disponível para compra online no momento.</em>
          </Text>
        )}
        <Stack mt={10}>
          <CustomButton
            colorScheme="gray"
            leftIcon={<MdShoppingCart size="25px" />}
            onClick={() => router.push('/store/cart')}
          >
            Carrinho
          </CustomButton>
          <PreviousButton href="/" />
        </Stack>
      </Box>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async ({}) => {
  return await client
    .query({
      query: ANALOG_ITEMS,
    })
    .then(({ data }) => {
      return {
        props: {
          products: data.analogItems.objects,
        },
        revalidate: 60,
      };
    });
};

export default Pos;
