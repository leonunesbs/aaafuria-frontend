import { ActivityIcon, CustomLink } from '@/components/atoms';
import { Box, HStack, Heading, Stack } from '@chakra-ui/react';
import { useContext, useMemo } from 'react';

import { Activity } from '@/pages/activities';
import { AddScheduleDrawer } from '../organisms';
import { AuthContext } from '@/contexts/AuthContext';
import { Card } from '../templates';
import ScheduleCard from './ScheduleCard';

interface ActivityCardProps {
  activity: {
    id: string;
    name: string;
    schedules: {
      edges: {
        node: Activity;
      }[];
    };
  };
  refetch: () => void;
}

export function ActivityCard({ activity, refetch }: ActivityCardProps) {
  const { user } = useContext(AuthContext);
  const activityName = useMemo(() => activity.name, [activity.name]);
  return (
    <Card w="full" py={6} px={[4, 6]}>
      <HStack mb={2} w="full" justify={'space-between'} pr={1}>
        <HStack>
          <ActivityIcon activityName={activityName} />
          <CustomLink
            href={`/activities/${activity.id}`}
            chakraLinkProps={{
              _hover: {
                textColor: 'green.500',
              },
            }}
          >
            <Heading size="sm">{activity.name.toUpperCase()}</Heading>
          </CustomLink>
        </HStack>
        {user?.isStaff && (
          <Box>
            <AddScheduleDrawer refetch={refetch} activityId={activity.id} />
          </Box>
        )}
      </HStack>
      <Stack overflowY={'auto'} rounded="md" p={1}>
        {activity.schedules.edges.map(({ node: schedule }) => (
          <ScheduleCard
            key={schedule.id}
            schedule={schedule}
            refetch={refetch}
          />
        ))}
      </Stack>
    </Card>
  );
}
