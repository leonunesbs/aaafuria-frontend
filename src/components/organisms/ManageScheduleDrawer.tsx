import { CustomButton, CustomIconButton } from '@/components/atoms';
import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Switch,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from '@chakra-ui/react';
import { MdAssignment, MdSave } from 'react-icons/md';
import { gql, useMutation, useQuery } from '@apollo/client';

import { AuthContext } from '@/contexts/AuthContext';
import { ColorContext } from '@/contexts/ColorContext';
import { useContext } from 'react';

const SET_PRESENCE = gql`
  mutation SetUserPresence(
    $scheduleId: ID!
    $userId: ID!
    $isPresent: Boolean!
  ) {
    setUserPresence(
      scheduleId: $scheduleId
      userId: $userId
      isPresent: $isPresent
    ) {
      ok
    }
  }
`;

function ParticipantRow({
  userId,
  member,
  scheduleData: { schedule },
  refetch,
}: {
  userId: string;
  scheduleData: ScheduleData;
  member: Member;

  refetch: () => void;
}) {
  const { token } = useContext(AuthContext);
  const { onToggle, isOpen } = useDisclosure({ defaultIsOpen: true });

  const isPresent = schedule.usersPresent.edges.some(
    ({ node: { id } }) => id === userId,
  );

  const [setPresence] = useMutation(SET_PRESENCE, {
    context: {
      headers: {
        authorization: `JWT ${token}`,
      },
    },
  });
  return (
    <Tr key={member.id}>
      <Td onClick={onToggle} cursor={'pointer'}>
        {isOpen ? member.nickname : member.name}
      </Td>
      <Td isNumeric>{member.group}</Td>
      <Td isNumeric>
        <Switch
          colorScheme={'green'}
          defaultChecked={isPresent}
          onChange={async ({ target: { checked } }) => {
            setPresence({
              variables: {
                userId,
                scheduleId: schedule.id,
                isPresent: checked,
              },
            });
            refetch();
          }}
        />
      </Td>
    </Tr>
  );
}

const GET_SCHEDULE = gql`
  query GetSchedule($scheduleId: ID) {
    schedule(scheduleId: $scheduleId) {
      id
      activity {
        id
        name
      }
      usersConfirmed {
        edges {
          node {
            id
            member {
              id
              nickname
              group
              name
            }
          }
        }
      }
      usersPresent {
        edges {
          node {
            id
            member {
              id
              nickname
              group
              name
            }
          }
        }
      }
    }
  }
`;

const DELETE_SCHEDULE = gql`
  mutation DeleteSchedule($scheduleId: ID!) {
    deleteSchedule(scheduleId: $scheduleId) {
      ok
    }
  }
`;

const END_SCHEDULE = gql`
  mutation EndSchedule($scheduleId: ID!) {
    endSchedule(scheduleId: $scheduleId) {
      ok
    }
  }
`;

interface ManageScheduleDrawerProps {
  scheduleId: string;
  refetch: () => void;
}

type Member = {
  id: string;
  nickname: string;
  group: string;
  name: string;
};

type ScheduleData = {
  schedule: {
    id: string;
    activity: {
      id: string;
      name: string;
    };
    usersConfirmed: {
      edges: {
        node: {
          id: string;
          member: Member;
        };
      }[];
    };
    usersPresent: {
      edges: {
        node: {
          id: string;
          member: Member;
        };
      }[];
    };
  };
};

export function ManageScheduleDrawer({
  scheduleId,
  refetch,
}: ManageScheduleDrawerProps) {
  const { token } = useContext(AuthContext);
  const { green, bg } = useContext(ColorContext);

  const { onOpen, isOpen, onClose } = useDisclosure();

  const { data, refetch: scheduleRefetch } = useQuery<ScheduleData>(
    GET_SCHEDULE,
    {
      variables: { scheduleId },
      context: {
        headers: {
          authorization: `JWT ${token}`,
        },
      },
    },
  );

  const [deleteSchedule] = useMutation(DELETE_SCHEDULE, {
    variables: { scheduleId },
    context: {
      headers: {
        authorization: `JWT ${token}`,
      },
    },
  });

  const [endSchedule, { loading }] = useMutation(END_SCHEDULE, {
    variables: { scheduleId },
    context: {
      headers: {
        authorization: `JWT ${token}`,
      },
    },
  });

  return (
    <>
      <CustomIconButton
        onClick={onOpen}
        size="sm"
        aria-label="adicionar atividade"
        icon={<MdAssignment size="20px" />}
      />
      <Drawer isOpen={isOpen} placement="right" size="md" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bgColor={bg}>
          <DrawerCloseButton color={green} />
          <DrawerHeader fontFamily={'AACHENN'}>
            GERENCIAR ATIVIDADE
          </DrawerHeader>
          <DrawerBody overflowY={'auto'}>
            <Stack mb={10}>
              <FormControl isReadOnly>
                <FormLabel htmlFor="activity">Atividade: </FormLabel>
                <Input
                  value={data?.schedule?.activity.name}
                  rounded="3xl"
                  focusBorderColor={green}
                />
              </FormControl>
              <TableContainer>
                <Table>
                  <Thead>
                    <Tr>
                      <Th>Participante</Th>
                      <Th isNumeric>Turma</Th>
                      <Th isNumeric>Frequência</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {data?.schedule?.usersConfirmed.edges.map(
                      ({ node: { id, member } }) => (
                        <ParticipantRow
                          key={id}
                          userId={id}
                          member={member}
                          scheduleData={data}
                          refetch={scheduleRefetch}
                        />
                      ),
                    )}
                  </Tbody>
                </Table>
              </TableContainer>
            </Stack>
            <Text
              textColor={'red'}
              fontSize="xs"
              textAlign={'right'}
              cursor="pointer"
              onClick={async () => {
                await deleteSchedule().then(() => {
                  refetch();
                  onClose();
                });
              }}
            >
              Excluir atividade
            </Text>
          </DrawerBody>

          <DrawerFooter>
            <CustomButton
              colorScheme={'gray'}
              mr={3}
              onClick={() => {
                onClose();
              }}
            >
              Cancelar
            </CustomButton>
            <CustomButton
              isLoading={loading}
              leftIcon={<MdSave size="20px" />}
              onClick={async () => {
                await endSchedule().then(() => {
                  refetch();
                  onClose();
                });
              }}
            >
              Encerrar treino
            </CustomButton>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
