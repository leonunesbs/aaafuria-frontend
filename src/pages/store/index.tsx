import { Box, Center, SimpleGrid, Stack, Text } from '@chakra-ui/react';
import { CustomButton, PageHeading } from '@/components/atoms';
import { gql, useQuery } from '@apollo/client';

import { AuthContext } from '@/contexts';
import { Layout } from '@/components/templates';
import { MdShoppingCart } from 'react-icons/md';
import { PreviousButton } from '@/components/atoms';
import { ProductCard } from '@/components/molecules';
import { useContext } from 'react';
import { useRouter } from 'next/router';

const DIGITAL_ITEMS = gql`
  query getDigitalItems {
    digitalItems {
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

interface StoreProps {
  products?: ProductType[];
}

function Store({}: StoreProps) {
  const router = useRouter();
  const { user } = useContext(AuthContext);

  const { data } = useQuery(DIGITAL_ITEMS, {});
  const products: ProductType[] = data?.digitalItems.objects;

  return (
    <Layout
      title="Loja"
      description="Adquira os produtos mais bonitos do Nordeste."
      keywords="loja, eventos, produtos, fúria, piauí"
    >
      <Box>
        <PageHeading>Loja</PageHeading>
        {user?.isStaff && (
          <Center mb={4}>
            <CustomButton maxW="xs" onClick={() => router.push('/store/pos')}>
              Loja Plantão
            </CustomButton>
          </Center>
        )}
        <SimpleGrid
          columns={{ base: user?.isStaff ? 2 : 1, md: 3, lg: 3 }}
          gap={2}
        >
          {products?.map((product) => {
            return <ProductCard key={product.id} node={product} />;
          })}
        </SimpleGrid>
        {products?.length === 0 && (
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

export default Store;
