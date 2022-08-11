import {
  Badge,
  Box,
  Collapse,
  HStack,
  Progress,
  Spinner,
  Stack,
  Switch,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { ChangeEvent, useCallback, useContext } from 'react';
import { MdLogin, MdMoreVert } from 'react-icons/md';
import { gql, useMutation } from '@apollo/client';

import { Activity } from '@/pages/activities';
import { AuthContext } from '@/contexts/AuthContext';
import { Card } from '../templates';
import { ColorContext } from '@/contexts/ColorContext';
import { CustomIconButton } from '../atoms';
import { ManageScheduleDrawer } from '../organisms';
import { useRouter } from 'next/router';

const CONFIRM_TO_SCHEDULE = gql`
  mutation confirmToSchedule($scheduleId: ID!) {
    confirmToSchedule(scheduleId: $scheduleId) {
      ok
    }
  }
`;

const CANCEL_FROM_SCHEDULE = gql`
  mutation cancelFromSchedule($scheduleId: ID!) {
    cancelFromSchedule(scheduleId: $scheduleId) {
      ok
    }
  }
`;

export interface ScheduleCardProps {
  schedule: Activity;
  refetch: () => void;
}

export default function ScheduleCard({ schedule, refetch }: ScheduleCardProps) {
  const router = useRouter();

  const { token, user, isAuthenticated } = useContext(AuthContext);
  const { green } = useContext(ColorContext);

  const toast = useToast();
  const { onToggle, isOpen } = useDisclosure();

  const [confirmToSchedule, { loading: confirmLoading }] = useMutation(
    CONFIRM_TO_SCHEDULE,
    {
      context: {
        headers: {
          authorization: `JWT ${token}`,
        },
      },
    },
  );
  const [cancelFromSchedule, { loading: cancelLoading }] = useMutation(
    CANCEL_FROM_SCHEDULE,
    {
      context: {
        headers: {
          authorization: `JWT ${token}`,
        },
      },
    },
  );
  const handleSwitch = useCallback(
    async (event: ChangeEvent<HTMLInputElement>, scheduleId: string) => {
      if (event.target.checked) {
        await confirmToSchedule({
          variables: {
            scheduleId,
          },
        })
          .then(({ data }) => {
            if (data.confirmToSchedule.ok) {
              refetch();
              toast({
                title: 'Participação confirmada',
                status: 'success',
                duration: 2500,
                isClosable: true,
                position: 'top-left',
              });
            } else {
              toast({
                title: 'Você deve ser Sócio para confirmar sua participação',
                status: 'warning',
                duration: 2500,
                isClosable: true,
                position: 'top-left',
              });
              refetch();
            }
          })
          .catch((error) => {
            toast({
              title: 'Erro ao confirmar participação.',
              description: error.message,
              status: 'error',
              duration: 2500,
              isClosable: true,
              position: 'top-left',
            });
          });
      } else {
        await cancelFromSchedule({
          variables: {
            scheduleId,
          },
        })
          .then(({ data }) => {
            if (data.cancelFromSchedule.ok) {
              refetch();
              toast({
                title: 'Participação removida',
                status: 'info',
                duration: 2500,
                isClosable: true,
                position: 'top-left',
              });
            }
          })
          .catch((error) => {
            toast({
              title: 'Erro ao remover participação.',
              description: error.message,
              status: 'error',
              duration: 2500,
              isClosable: true,
              position: 'top-left',
            });
          });
      }
    },
    [cancelFromSchedule, confirmToSchedule, refetch, toast],
  );
  return (
    <Card
      key={schedule.id}
      position={'relative'}
      rounded={'lg'}
      overflow="hidden"
      p={0}
      px={0}
    >
      <HStack p={2} w="full" justify="space-between" align={'flex-end'}>
        <Stack>
          <Box fontSize="sm">
            {schedule.location}
            <br />
            <Box fontSize="xs">
              {new Date(schedule.startDate as string).toLocaleString('pt-BR', {
                dateStyle: 'short',
                timeStyle: 'short',
                timeZone: 'America/Sao_Paulo',
              })}
            </Box>
            <HStack>
              {schedule.tags?.map((tag) => (
                <Badge
                  key={tag}
                  colorScheme="green"
                  variant="subtle"
                  rounded="full"
                  fontSize="xx-small"
                >
                  {tag.toUpperCase()}
                </Badge>
              ))}
            </HStack>
          </Box>
          <Box fontSize="xs">{schedule.description}</Box>
        </Stack>
        <Stack>
          {confirmLoading || cancelLoading === true ? (
            <Spinner color={green} />
          ) : isAuthenticated ? (
            <Switch
              colorScheme={'green'}
              isChecked={schedule.currentUserConfirmed}
              onChange={(e) => handleSwitch(e, schedule.id)}
            />
          ) : (
            <CustomIconButton
              aria-label={'login'}
              icon={<MdLogin size="20px" />}
              onClick={() => router.push(`/entrar?after=${router.asPath}`)}
            />
          )}
          <CustomIconButton
            size="sm"
            variant={'ghost'}
            icon={<MdMoreVert size="15px" />}
            aria-label="ver mais"
            onClick={onToggle}
          />
        </Stack>
      </HStack>
      <Collapse in={isOpen}>
        <HStack w="full" justify={'space-between'} align="center" px={2} pb={2}>
          <Stack fontSize="x-small" spacing={0} fontStyle="italic">
            <Text>Mínimo: {schedule.minParticipants}</Text>
            <Text>Confirmados: {schedule.confirmedCount}</Text>
            <Text>Status: {schedule.status}</Text>
          </Stack>
          {user?.isStaff && (
            <ManageScheduleDrawer scheduleId={schedule.id} refetch={refetch} />
          )}
        </HStack>
      </Collapse>

      <Progress
        position={'absolute'}
        value={(schedule.confirmedCount / schedule.maxParticipants) * 100}
        hasStripe={schedule.confirmedCount >= schedule.maxParticipants}
        isAnimated
        colorScheme={
          schedule.confirmedCount < schedule.minParticipants ? 'gray' : 'green'
        }
        w="full"
        bottom={-2}
        left={0}
      />
    </Card>
  );
}
