import { Controller, SubmitHandler, useForm } from 'react-hook-form';
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
  FormHelperText,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputLeftAddon,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Stack,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { MdAdd, MdSave } from 'react-icons/md';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useCallback, useContext } from 'react';

import { AuthContext } from '@/contexts/AuthContext';
import { ColorContext } from '@/contexts/ColorContext';

const ALL_ACTIVITIES = gql`
  query allActivities {
    allActivities {
      id
      name
    }
  }
`;

const CREATE_SCHEDULE = gql`
  mutation createSchedule(
    $activityId: ID!
    $description: String!
    $startDate: DateTime!
    $endDate: DateTime
    $location: String!
    $minParticipants: Int!
    $maxParticipants: Int!
    $cost: Float
    $tags: String
  ) {
    createSchedule(
      activityId: $activityId
      description: $description
      startDate: $startDate
      endDate: $endDate
      location: $location
      minParticipants: $minParticipants
      maxParticipants: $maxParticipants
      cost: $cost
      tags: $tags
    ) {
      ok
    }
  }
`;

type ActivitiesData = {
  allActivities: {
    id: string;
    name: string;
  }[];
};

type Inputs = {
  activityId: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  minParticipants: number;
  maxParticipants: number;
  cost: number;
  tags: string;
};

interface AddScheduleDrawerProps {
  refetch: () => void;
  activityId?: string;
}

export function AddScheduleDrawer({
  refetch,
  activityId,
}: AddScheduleDrawerProps) {
  const toast = useToast();
  const { token } = useContext(AuthContext);
  const { bg, green } = useContext(ColorContext);
  const { onOpen, isOpen, onClose } = useDisclosure();
  const { handleSubmit, reset, register, control } = useForm<Inputs>();

  const { data } = useQuery<ActivitiesData>(ALL_ACTIVITIES, {
    context: {
      headers: {
        Authorization: `JWT ${token}`,
      },
    },
  });

  const [createSchedule] = useMutation(CREATE_SCHEDULE, {
    context: {
      headers: {
        Authorization: `JWT ${token}`,
      },
    },
  });

  const onSubmit: SubmitHandler<Inputs> = useCallback(
    async (data) => {
      await createSchedule({
        variables: {
          ...data,
          startDate: new Date(data.startDate),
          endDate: data.endDate ? new Date(data.endDate) : null,
          cost: data.cost ? parseFloat(data.cost.toString()) : null,
        },
      })
        .then(({ data }) => {
          if (data.createSchedule?.ok) {
            onClose();
            refetch();
            reset();

            toast({
              title: 'Programação criada',
              description: 'Nova programação criada com sucesso',
              status: 'success',
              duration: 2500,
              isClosable: true,
              position: 'top-left',
            });
          }
        })
        .catch((error) => {
          toast({
            title: 'Error',
            description: error.message,
            status: 'error',
            duration: 2500,
            isClosable: true,
            position: 'top-left',
          });
        });
    },
    [createSchedule, onClose, refetch, reset, toast],
  );
  return (
    <>
      <CustomIconButton
        onClick={onOpen}
        aria-label="adicionar atividade"
        icon={<MdAdd size="20px" />}
      />
      <Drawer isOpen={isOpen} placement="right" size="md" onClose={onClose}>
        <DrawerOverlay />
        <form onSubmit={handleSubmit(onSubmit)}>
          <DrawerContent bgColor={bg}>
            <DrawerCloseButton color={green} onClick={() => reset()} />
            <DrawerHeader fontFamily={'AACHENN'}>NOVA ATIVIDADE</DrawerHeader>
            <DrawerBody overflowY={'auto'}>
              <Stack>
                <FormControl isRequired>
                  <FormLabel htmlFor="activity">Atividade: </FormLabel>
                  <Select
                    focusBorderColor={green}
                    required
                    placeholder="Selecione uma atividade"
                    defaultValue={activityId}
                    {...register('activityId')}
                  >
                    {data?.allActivities.map((activity) => (
                      <option key={activity.id} value={activity.id}>
                        {activity.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel htmlFor="location">Local: </FormLabel>
                  <Controller
                    name="location"
                    control={control}
                    render={({ field }) => (
                      <Input
                        rounded="3xl"
                        focusBorderColor={green}
                        isRequired
                        {...field}
                      />
                    )}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel htmlFor="description">Descrição: </FormLabel>
                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <Input
                        rounded="3xl"
                        focusBorderColor={green}
                        isRequired
                        {...field}
                      />
                    )}
                  />
                  <FormHelperText>ex.: Treino para o amistoso</FormHelperText>
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="tags">Tags: </FormLabel>
                  <Controller
                    name="tags"
                    control={control}
                    render={({ field }) => (
                      <Input
                        rounded="3xl"
                        focusBorderColor={green}
                        {...field}
                      />
                    )}
                  />
                  <FormHelperText>ex.: feminino, amistoso</FormHelperText>
                  <FormHelperText>
                    obs.: Separe os valores por vírgula
                  </FormHelperText>
                </FormControl>

                <Stack direction={['column', 'row']}>
                  <FormControl isRequired>
                    <FormLabel htmlFor="startDate">Início: </FormLabel>
                    <Controller
                      name="startDate"
                      control={control}
                      render={({ field }) => (
                        <Input
                          rounded="3xl"
                          focusBorderColor={green}
                          isRequired
                          type={'datetime-local'}
                          {...field}
                        />
                      )}
                    />
                    <FormHelperText>
                      Data e hora de início da atividade
                    </FormHelperText>
                  </FormControl>
                  <FormControl>
                    <FormLabel htmlFor="endDate">Fim: </FormLabel>

                    <Controller
                      name="endDate"
                      control={control}
                      render={({ field }) => (
                        <Input
                          rounded="3xl"
                          focusBorderColor={green}
                          type={'datetime-local'}
                          {...field}
                        />
                      )}
                    />
                    <FormHelperText>
                      Data e hora de fim da atividade (opcional)
                    </FormHelperText>
                  </FormControl>
                </Stack>

                <HStack>
                  <FormControl isRequired>
                    <FormLabel htmlFor="minParticipants">
                      Mínimo de participantes:
                    </FormLabel>
                    <Controller
                      name="minParticipants"
                      control={control}
                      render={({ field }) => (
                        <NumberInput
                          focusBorderColor={green}
                          rounded="3xl"
                          min={1}
                        >
                          <NumberInputField required {...field} />
                          <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                          </NumberInputStepper>
                        </NumberInput>
                      )}
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel htmlFor="maxParticipants">
                      Participantes esperados:
                    </FormLabel>
                    <Controller
                      name="maxParticipants"
                      control={control}
                      render={({ field }) => (
                        <NumberInput
                          focusBorderColor={green}
                          rounded="3xl"
                          min={1}
                        >
                          <NumberInputField required {...field} />
                          <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                          </NumberInputStepper>
                        </NumberInput>
                      )}
                    />
                  </FormControl>
                </HStack>
                <FormControl>
                  <FormLabel htmlFor="cost">Custo esperado: </FormLabel>
                  <Controller
                    name="cost"
                    control={control}
                    render={({ field }) => (
                      <NumberInput
                        focusBorderColor={green}
                        min={0}
                        precision={2}
                      >
                        <InputGroup>
                          <InputLeftAddon>R$</InputLeftAddon>
                          <NumberInputField borderLeftRadius={0} {...field} />
                        </InputGroup>
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    )}
                  />
                </FormControl>
              </Stack>
            </DrawerBody>

            <DrawerFooter>
              <CustomButton
                colorScheme={'gray'}
                mr={3}
                onClick={() => {
                  onClose();
                  reset();
                }}
              >
                Cancelar
              </CustomButton>
              <CustomButton leftIcon={<MdSave size="20px" />} type="submit">
                Salvar
              </CustomButton>
            </DrawerFooter>
          </DrawerContent>
        </form>
      </Drawer>
    </>
  );
}
