import { Badge, HStack, Text } from '@chakra-ui/react';
import {
  CustomIconButton,
  CustomLink,
  SelectColumnFilter,
} from '@/components/atoms';
import { gql, useQuery } from '@apollo/client';
import { useContext, useMemo } from 'react';

import { AuthContext } from '@/contexts/AuthContext';
import { Column } from 'react-table';
import { CustomTable } from '../templates';
import { MdMoreHoriz } from 'react-icons/md';

const ALL_PAYMENTS = gql`
  query allPayments($page: Int = 1, $status: String) {
    allPayments(page: $page, status: $status, pageSize: 0) {
      page
      pages
      hasNext
      hasPrev
      objects {
        id
        user {
          member {
            name
          }
        }
        amount
        currency
        description
        method
        createdAt
        updatedAt
        status
      }
    }
  }
`;

interface PaymentsTableProps {
  children?: React.ReactNode;
}

export type Payment = {
  id: string;
  user: {
    member: {
      name: string;
    };
  };
  amount: number;
  currency: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  status: string;
};

type PaymentsData = {
  allPayments: {
    page: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
    objects: Payment[];
  };
};

export function PaymentsTable({}: PaymentsTableProps) {
  const { token } = useContext(AuthContext);

  const { data, loading } = useQuery<PaymentsData>(ALL_PAYMENTS, {
    context: {
      headers: {
        Authorization: `JWT ${token}`,
      },
    },
  });

  const tableData: Payment[] = useMemo(() => {
    return data?.allPayments.objects || [];
  }, [data]);

  const tableColumns: Column<Payment>[] = useMemo(
    () =>
      [
        {
          id: 'id',
          Header: 'Ações',
          accessor: 'id',
          disableFilters: true,
          Cell: ({ value }: { value: string }) => {
            return (
              <HStack spacing={1}>
                <CustomLink href={`/bank/payments/${value}`}>
                  <CustomIconButton
                    variant={'link'}
                    icon={<MdMoreHoriz size="20px" />}
                    aria-label="ver mais"
                  />
                </CustomLink>
              </HStack>
            );
          },
        },
        {
          id: 'user',
          Header: 'Membro',
          accessor: 'user.member.name',
        },
        {
          id: 'description',
          Header: 'Descrição',
          accessor: 'description',
        },
        {
          id: 'amount',
          Header: 'Valor',
          accessor: 'amount',
        },
        {
          id: 'currency',
          Header: 'Moeda',
          accessor: 'currency',
          Filter: SelectColumnFilter,
          filter: 'include',
        },
        {
          id: 'method',
          Header: 'Método',
          accessor: 'method',
          Filter: SelectColumnFilter,
          filter: 'include',
        },
        {
          id: 'status',
          Header: 'Status',
          accessor: 'status',
          Filter: SelectColumnFilter,
          filter: 'include',
          Cell: ({ value }: { value: string }) => {
            return (
              <Text>
                <Badge
                  colorScheme={
                    value === 'PAGO'
                      ? 'green'
                      : value === 'PENDENTE'
                      ? 'yellow'
                      : 'gray'
                  }
                >
                  {value}
                </Badge>
              </Text>
            );
          },
        },
        {
          id: 'createdAt',
          Header: 'Criado em',
          accessor: 'createdAt',
          disableFilters: true,
          Cell: ({ value }: { value: string }) => {
            return (
              <Text as={'time'} dateTime={value}>
                {new Date(value).toLocaleString('pt-BR', {
                  timeStyle: 'short',
                  dateStyle: 'short',
                  timeZone: 'America/Sao_Paulo',
                })}
              </Text>
            );
          },
        },
        {
          id: 'id2',
          Header: 'Ações',
          accessor: 'id',
          disableFilters: true,
          Cell: ({ value }: { value: string }) => {
            return (
              <HStack spacing={1}>
                <CustomLink href={`/bank/payments/${value}`}>
                  <CustomIconButton
                    variant={'link'}
                    icon={<MdMoreHoriz size="20px" />}
                    aria-label="ver mais"
                  />
                </CustomLink>
              </HStack>
            );
          },
        },
      ] as Column<Payment>[],
    [],
  );

  return (
    <CustomTable loading={loading} data={tableData} columns={tableColumns} />
  );
}
