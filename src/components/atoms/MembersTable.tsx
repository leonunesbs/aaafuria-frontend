import { HiCheckCircle, HiXCircle } from 'react-icons/hi';
import { ReactNode, useContext, useMemo } from 'react';
import { gql, useQuery } from '@apollo/client';

import { AuthContext } from '@/contexts/AuthContext';
import { ColorContext } from '@/contexts/ColorContext';
import { Column } from 'react-table';
import { CustomTable } from '../templates';
import { Icon } from '@chakra-ui/react';
import { SelectColumnFilter } from './SelectColumnFilter';

const ALL_MEMBERS = gql`
  query allMembers {
    allMembers {
      id
      registration
      name
      nickname
      group
      isFirstTeamer
      hasActiveMembership
      activeMembership {
        id
        membershipPlan {
          title
        }
      }
    }
  }
`;

type Member = {
  id: string;
  registration: string;
  name: string;
  nickname: string;
  group: string;
  hasActiveMembership: boolean;
  activeMembership: {
    id: string;
    membershipPlan: {
      title: string;
    };
  };
};

type MemberData = {
  allMembers: Member[];
};

export interface MembersTableProps {
  childre?: ReactNode;
}

export function MembersTable({}: MembersTableProps) {
  const { token } = useContext(AuthContext);
  const { green } = useContext(ColorContext);
  const { data, loading } = useQuery<MemberData>(ALL_MEMBERS, {
    context: {
      headers: {
        authorization: `JWT ${token}`,
      },
    },
  });

  const tableData: Member[] = useMemo(() => {
    return data?.allMembers || [];
  }, [data]);

  const tableColumns: Column<Member>[] = useMemo(
    () =>
      [
        {
          id: 'registration',
          Header: 'Matrícula',
          accessor: 'registration',
        },
        {
          id: 'name',
          Header: 'Nome',
          accessor: 'name',
        },
        {
          id: 'group',
          Header: 'Turma',
          accessor: 'group',
        },
        {
          id: 'isFirstTeamer',
          Header: 'Atleta',
          accessor: 'isFirstTeamer',
          Filter: SelectColumnFilter,
          filter: 'include',
          Cell: ({ value: isFirstTeamer }: { value: boolean }) => {
            return (
              <Icon
                as={isFirstTeamer ? HiCheckCircle : HiXCircle}
                color={isFirstTeamer ? green : 'red.500'}
                h={4}
                w={4}
              />
            );
          },
        },
        {
          id: 'hasActiveMembership',
          Header: 'Sócio',
          accessor: 'hasActiveMembership',
          Filter: SelectColumnFilter,
          filter: 'include',
          Cell: ({ value: isSocio }: { value: boolean }) => {
            return (
              <Icon
                as={isSocio ? HiCheckCircle : HiXCircle}
                color={isSocio ? green : 'red.500'}
                h={4}
                w={4}
              />
            );
          },
        },
        {
          id: 'activeMembership',
          Header: 'Plano',
          accessor: 'activeMembership.membershipPlan.title',
          Filter: SelectColumnFilter,
          filter: 'include',
          Cell: ({ value }: { value: string }) => {
            return <>{value}</> || <>{'-'}</>;
          },
        },
      ] as Column<Member>[],
    [green],
  );

  return (
    <CustomTable columns={tableColumns} data={tableData} loading={loading} />
  );
}
