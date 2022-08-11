import {
  Badge,
  Collapse,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  FormControl,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Radio,
  RadioGroup,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import {
  CustomButton,
  CustomIconButton,
  PaymentMethods,
} from '@/components/atoms';
import { MdAdd, MdCheck } from 'react-icons/md';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useCallback, useContext, useRef, useState } from 'react';

import { AuthContext } from '@/contexts/AuthContext';
import { Card } from '../templates';
import { ColorContext } from '@/contexts/ColorContext';
import { FaFileInvoiceDollar } from 'react-icons/fa';

const GET_MEMBER = gql`
  query ($registration: String) {
    memberByRegistration(registration: $registration) {
      id
      name
      group
    }
  }
`;

const CHECKOUT_MEMBERSHIP = gql`
  mutation ($membershipId: ID!, $methodId: String!, $userUsername: String!) {
    checkoutMembership(
      membershipId: $membershipId
      methodId: $methodId
      userUsername: $userUsername
    ) {
      ok
    }
  }
`;

export interface AddMembershipDrawerProps {
  membershipPlans: {
    node: {
      id: string;
      name: string;
      membersCount: number;
      isActive: boolean;
    };
  }[];
}

type Inputs = {
  registration: string;
  membersipPlan: string;
  method: string;
};

type MemberByRegistrationData = {
  memberByRegistration: {
    id: string;
    name: string;
    group: string;
  };
};

export function AddMembershipDrawer({
  membershipPlans,
}: AddMembershipDrawerProps) {
  const toast = useToast();
  const btnRef = useRef<HTMLButtonElement>(null);
  const { token } = useContext(AuthContext);
  const { bg, green } = useContext(ColorContext);
  const { onOpen, isOpen, onClose } = useDisclosure();
  const [registrationChecked, setRegistrationChecked] = useState(false);

  const { data: memberData, refetch: refetchMemberData } =
    useQuery<MemberByRegistrationData>(GET_MEMBER, {
      context: {
        headers: {
          authorization: `JWT ${token}`,
        },
      },
    });

  const [checkoutMembership] = useMutation(CHECKOUT_MEMBERSHIP, {
    context: {
      headers: {
        authorization: `JWT ${token}`,
      },
    },
  });

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<Inputs>();

  const handleCheckRegistration = useCallback(() => {
    const registration = getValues('registration');
    if (!registration) {
      setError('registration', {
        message: 'Campo obrigatório',
      });
      return;
    }
    refetchMemberData({
      registration,
    });
    setRegistrationChecked(true);
  }, [getValues, refetchMemberData, setError]);

  const onSubmit: SubmitHandler<Inputs> = useCallback(
    async (data) => {
      await checkoutMembership({
        variables: {
          membershipId: data.membersipPlan,
          methodId: data.method,
          userUsername: data.registration,
        },
      }).then(({ data }) => {
        if (data.checkoutMembership.ok) {
          reset();
          onClose();
          setRegistrationChecked(false);
          toast({
            title: 'Sucesso',
            description:
              'Fatura gerada com sucesso. Aguardando confirmação de pagamento.',
            status: 'success',
            duration: 2500,
            isClosable: true,
            position: 'top-left',
          });
        }
      });
    },
    [checkoutMembership, onClose, reset, toast],
  );
  return (
    <>
      <CustomIconButton
        ref={btnRef}
        onClick={onOpen}
        aria-label="adicionar associação"
        icon={<MdAdd size="20px" />}
      />
      <Drawer isOpen={isOpen} placement="right" size="sm" onClose={onClose}>
        <DrawerOverlay />
        <form onSubmit={handleSubmit(onSubmit)}>
          <DrawerContent bgColor={bg}>
            <DrawerCloseButton color={green} />
            <DrawerHeader fontFamily={'AACHENN'}>NOVA ASSOCIAÇÃO</DrawerHeader>
            <DrawerBody>
              <Stack>
                <FormControl isRequired>
                  <FormLabel>Matrícula: </FormLabel>
                  <InputGroup size="md">
                    <Controller
                      name="registration"
                      control={control}
                      rules={{
                        onChange: () => clearErrors('registration'),
                      }}
                      render={({ field }) => (
                        <Input
                          autoFocus
                          pr="4.5rem"
                          isRequired
                          rounded="3xl"
                          focusBorderColor={green}
                          isDisabled={registrationChecked}
                          isInvalid={!!errors.registration}
                          {...field}
                        />
                      )}
                    />

                    <InputRightElement width="4.5rem">
                      {!registrationChecked ? (
                        <CustomButton
                          h="1.75rem"
                          variant={'ghost'}
                          onClick={handleCheckRegistration}
                        >
                          Checar
                        </CustomButton>
                      ) : (
                        <CustomIconButton
                          h="1.75rem"
                          size="sm"
                          icon={<MdCheck size="20px" />}
                          aria-label="checar"
                          isDisabled
                        />
                      )}
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
                <Collapse in={registrationChecked}>
                  <Card m={4} textAlign="center">
                    <Text>{memberData?.memberByRegistration?.name}</Text>
                    <Text>
                      <Badge ml={2}>
                        {memberData?.memberByRegistration?.group}
                      </Badge>
                    </Text>
                  </Card>
                </Collapse>
                <Collapse in={registrationChecked}>
                  <Controller
                    name="membersipPlan"
                    control={control}
                    rules={{ required: 'Plano obrigatório' }}
                    render={({ field }) => (
                      <FormControl isRequired>
                        <FormLabel>Plano: </FormLabel>
                        <RadioGroup {...field} colorScheme={'green'}>
                          <HStack>
                            {membershipPlans.map(
                              ({ node }) =>
                                node.isActive && (
                                  <Radio
                                    key={node.id}
                                    value={node.id}
                                    colorScheme={'green'}
                                  >
                                    {node.name}
                                  </Radio>
                                ),
                            )}
                          </HStack>
                        </RadioGroup>
                      </FormControl>
                    )}
                  />
                  <Controller
                    name="method"
                    control={control}
                    rules={{ required: 'Método obrigatório' }}
                    render={({ field }) => <PaymentMethods {...field} />}
                  />
                </Collapse>
              </Stack>
            </DrawerBody>

            <DrawerFooter>
              <CustomButton
                colorScheme={'gray'}
                mr={3}
                onClick={() => {
                  onClose();
                  reset();
                  setRegistrationChecked(false);
                }}
              >
                Cancelar
              </CustomButton>
              <CustomButton
                leftIcon={<FaFileInvoiceDollar size="20px" />}
                type="submit"
              >
                Gerar fatura
              </CustomButton>
            </DrawerFooter>
          </DrawerContent>
        </form>
      </Drawer>
    </>
  );
}
