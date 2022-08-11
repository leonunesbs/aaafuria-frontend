import {
  Box,
  HStack,
  Heading,
  Stack,
  Stat,
  StatGroup,
  StatLabel,
  StatNumber,
} from '@chakra-ui/react';
import { ReactNode, useContext } from 'react';
import { gql, useQuery } from '@apollo/client';

import { AddMembershipDrawer } from '../organisms';
import { Card } from '../templates';
import { ColorContext } from '@/contexts';
import { MembersTable } from '../atoms';

const MEMBERSHIP_PLANS = gql`
  query {
    allMembershipPlans {
      edges {
        node {
          id
          name
          membersCount
          isActive
        }
      }
    }
  }
`;
type MembershipPlans = {
  allMembershipPlans: {
    edges: {
      node: {
        id: string;
        name: string;
        membersCount: number;
        isActive: boolean;
      };
    }[];
  };
};

interface MembersDashboardCardProps {
  children?: ReactNode;
}

export function MembersDashboardCard({}: MembersDashboardCardProps) {
  const { green } = useContext(ColorContext);
  const membershipPlans = useQuery<MembershipPlans>(MEMBERSHIP_PLANS);

  return (
    <Stack spacing={4}>
      <Card>
        <HStack w="full" justify={'space-between'} mb={4}>
          <Box>
            <Heading size="md" color={green}>
              ASSOCIAÇÕES
            </Heading>
          </Box>
          {membershipPlans.data && (
            <AddMembershipDrawer
              membershipPlans={membershipPlans.data.allMembershipPlans.edges}
            />
          )}
        </HStack>
        <StatGroup>
          {membershipPlans.data?.allMembershipPlans.edges.map(
            ({ node: { id, name, membersCount } }) => (
              <Stat key={id}>
                <StatLabel>{name}</StatLabel>
                <StatNumber>{membersCount}</StatNumber>
              </Stat>
            ),
          )}
        </StatGroup>
      </Card>
      <Card>
        <Box mb={4}>
          <Heading size="md" color={green}>
            MEMBROS
          </Heading>
        </Box>
        <MembersTable />
      </Card>
    </Stack>
  );
}
