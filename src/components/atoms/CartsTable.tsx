import { Box, Icon, Text, useToast } from '@chakra-ui/react';
import {
  CustomButton,
  ObjectColumnFilter,
  SelectColumnFilter,
} from '@/components/atoms';
import { HiCheckCircle, HiXCircle } from 'react-icons/hi';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useContext, useMemo } from 'react';

import { AuthContext } from '@/contexts/AuthContext';
import { ColorContext } from '@/contexts/ColorContext';
import { Column } from 'react-table';
import { CustomTable } from '../templates';
import { MdCheck } from 'react-icons/md';

const ALL_CARTS = gql`
  query {
    allCarts {
      id
      user {
        member {
          nickname
          name
        }
      }
      total
      items {
        edges {
          node {
            id
            title
            item {
              name
              refItem {
                name
              }
            }
            description
            quantity
          }
        }
      }
      delivered
      ordered
      createdAt
      updatedAt
    }
  }
`;

const DELIVER_CART = gql`
  mutation DeliverCart($cartId: ID!) {
    deliverCart(cartId: $cartId) {
      ok
    }
  }
`;

type Item = {
  id: string;
  title: string;
  item: {
    name: string;
    refItem: {
      name: string;
    };
  };
  description: string;
  quantity: number;
};

type Cart = {
  id: string;
  user: {
    member: {
      nickname: string;
      name: string;
    };
  };
  total: number;
  items: {
    edges: {
      node: Item[];
    };
  };
  delivered: boolean;
  ordered: boolean;
  createdAt: string;
  updatedAt: string;
};

type CartsData = {
  allCarts: Cart[];
};

interface CartsTableProps {
  shortView?: boolean;
}

export function CartsTable({}: CartsTableProps) {
  const toast = useToast();
  const { token } = useContext(AuthContext);
  const { green } = useContext(ColorContext);
  const { data, refetch, loading } = useQuery<CartsData>(ALL_CARTS, {
    context: {
      headers: {
        Authorization: `JWT ${token}`,
      },
    },
  });
  const [deliverCart] = useMutation(DELIVER_CART, {
    context: {
      headers: {
        Authorization: `JWT ${token}`,
      },
    },
  });

  const tableData: Cart[] = useMemo(() => {
    return data?.allCarts || [];
  }, [data]);

  const tableColumns: Column<Cart>[] = useMemo(
    () =>
      [
        {
          id: 'user',
          Header: 'Membro',
          accessor: 'user.member.name',
        },
        {
          id: 'items',
          Header: 'Itens',
          accessor: 'items',
          Filter: ObjectColumnFilter,
          filter: 'object',
          Cell: ({
            value: { edges },
          }: {
            value: { edges: { node: Item }[] };
          }) => {
            return edges.map((item) => (
              <Box key={item.node.id} fontSize="xs" mb={2}>
                <Text>
                  {item.node.quantity}x {item.node.title}
                </Text>
                {item.node.description && (
                  <Text fontStyle={'italic'} fontSize="xx-small">
                    Obs.: {item.node.description}
                  </Text>
                )}
              </Box>
            ));
          },
        },
        {
          id: 'ordered',
          Header: 'Pago',
          accessor: 'ordered',
          Filter: SelectColumnFilter,
          filter: 'include',
          Cell: ({ value: ordered }: { value: boolean }) => {
            return (
              <Icon
                as={ordered ? HiCheckCircle : HiXCircle}
                color={ordered ? green : 'red.500'}
                h={4}
                w={4}
              />
            );
          },
        },
        {
          id: 'delivered',
          Header: 'Entregue',
          accessor: 'delivered',
          Filter: SelectColumnFilter,
          filter: 'include',
          Cell: ({ value: delivered }: { value: boolean }) => {
            return (
              <Icon
                as={delivered ? HiCheckCircle : HiXCircle}
                color={delivered ? green : 'red.500'}
                h={4}
                w={4}
              />
            );
          },
        },
        {
          id: 'updatedAt',
          Header: 'Atualizado em',
          accessor: 'updatedAt',
          disableFilters: true,
          Cell: ({ value }: { value: string }) =>
            new Date(value).toLocaleString('pt-BR', {
              timeStyle: 'short',
              dateStyle: 'short',
              timeZone: 'America/Sao_Paulo',
            }),
        },
        {
          id: 'id',
          Header: 'Ações',
          accessor: 'id',
          disableFilters: true,
          Cell: ({ value }: { value: boolean }) => {
            return (
              <CustomButton
                variant={'link'}
                size="xs"
                maxH={4}
                leftIcon={<MdCheck size="10px" />}
                isLoading={loading}
                onClick={async () => {
                  await deliverCart({
                    variables: { cartId: value },
                  })
                    .then(() => {
                      toast({
                        title: 'Pedido entregue',
                        description: 'O pedido foi entregue!',
                        status: 'success',
                        duration: 2500,
                        isClosable: true,
                        position: 'top-left',
                      });
                      refetch();
                    })
                    .catch((error) => {
                      toast({
                        title: 'Erro',
                        description: error.message,
                        status: 'warning',
                        duration: 2500,
                        isClosable: true,
                        position: 'top-left',
                      });
                    });
                }}
              >
                Entregar
              </CustomButton>
            );
          },
        },
      ] as Column<Cart>[],
    [deliverCart, green, loading, refetch, toast],
  );

  return (
    <CustomTable columns={tableColumns} data={tableData} loading={loading} />
  );
}
