import {
  As,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
  PinInput,
  PinInputField,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';
import { AuthContext, ColorContext } from '@/contexts';
import { Card, Layout } from '../templates';
import { Controller, useForm } from 'react-hook-form';
import { CustomButton, PageHeading } from '../atoms';
import { gql, useMutation } from '@apollo/client';
import { useCallback, useContext, useEffect, useState } from 'react';

import InputMask from 'react-input-mask';
import { useRouter } from 'next/router';

const CREATE_ACCOUNT = gql`
  mutation createAccount(
    $username: String!
    $password: String!
    $email: String!
    $name: String!
    $nickname: String!
    $phone: String!
    $rg: String!
    $cpf: String!
    $birthDate: String!
    $group: String!
    $avatar: Upload!
  ) {
    createAccount(
      username: $username
      password: $password
      email: $email
      name: $name
      nickname: $nickname
      phone: $phone
      rg: $rg
      cpf: $cpf
      birthDate: $birthDate
      group: $group
      avatar: $avatar
    ) {
      member {
        id
      }
    }
  }
`;

type SignUpInputType = {
  matricula: string;
  confirmMatricula: string;
  turma: string;
  pin: string;
  confirmPin: string;
  email: string;
  confirmEmail: string;
  nome: string;
  whatsapp: string;
  apelido: string;
  dataNascimento: string;
  rg: string;
  cpf: string;
  avatar: string;
};

interface SignUpDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SignUpDrawer({ isOpen, onClose, ...rest }: SignUpDrawerProps) {
  const router = useRouter();
  const toast = useToast();

  const { signup, after }: { signup?: string; after?: string } = router.query;

  const { green } = useContext(ColorContext);
  const { signIn } = useContext(AuthContext);
  const [matricula, setMatricula] = useState('');

  const { control, handleSubmit, setValue } = useForm<SignUpInputType>({
    defaultValues: {
      matricula: signup,
    },
  });

  const [mutateFunction, { loading, error }] = useMutation(CREATE_ACCOUNT);

  const signUp = useCallback(
    async (data: SignUpInputType) => {
      if (data.pin !== data.confirmPin) {
        toast({
          description: 'Os PINs inseridos são diferentes.',
          status: 'warning',
          duration: 2500,
          isClosable: true,
          position: 'top-left',
        });
        return;
      }
      if (data.email !== data.confirmEmail) {
        toast({
          description: 'Os Emails inseridos são diferentes.',
          status: 'warning',
          duration: 2500,
          isClosable: true,
          position: 'top-left',
        });
        return;
      }

      if (data.matricula !== data.confirmMatricula) {
        toast({
          description: 'As matrículas inseridas são diferentes.',
          status: 'warning',
          duration: 2500,
          isClosable: true,
          position: 'top-left',
        });
        return;
      }

      mutateFunction({
        variables: {
          username: data.matricula,
          password: data.pin,
          email: data.email,
          name: data.nome,
          nickname: data.apelido,
          phone: data.whatsapp,
          rg: data.rg,
          cpf: data.cpf,
          birthDate: data.dataNascimento,
          group: data.turma,
          avatar: data.avatar[0],
        },
      }).then((res) => {
        if (res.data) {
          signIn({
            matricula: data.matricula,
            pin: data.pin,
            redirectUrl: after,
          });
        }
      });
    },
    [after, mutateFunction, signIn, toast],
  );

  const handleClose = useCallback(() => {
    onClose();
    router.replace(`/login${after ? `?after=${after}` : ''}`);
  }, [after, onClose, router]);

  useEffect(() => {
    setValue('matricula', matricula);
    setMatricula(signup || '');
  }, [signup, isOpen, matricula, setValue]);

  return (
    <Drawer
      size="sm"
      placement="top"
      onClose={handleClose}
      isOpen={isOpen}
      {...rest}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerBody p={0} mb={14}>
          <Layout
            title="Cadastro"
            description="Crie sua conta na plataforma!"
            isHeaded={false}
            isFooted={false}
          >
            <PageHeading>Crie sua conta</PageHeading>
            <Card>
              <form id="signUp" onSubmit={handleSubmit(signUp)}>
                <Stack spacing={4}>
                  <FormControl>
                    <FormLabel>Matrícula: </FormLabel>
                    <Controller
                      name="matricula"
                      control={control}
                      rules={{
                        required: 'Matrícula obrigatória',
                        minLength: {
                          value: 8,
                          message: 'Matrícula deve conter 8 números',
                        },
                        maxLength: {
                          value: 8,
                          message: 'Matrícula deve conter 8 números',
                        },
                      }}
                      render={({ field }) => (
                        <HStack>
                          <PinInput
                            size="lg"
                            focusBorderColor="green.500"
                            placeholder=""
                            isDisabled
                            {...field}
                          >
                            <PinInputField />
                            <PinInputField />
                            <PinInputField />
                            <PinInputField />
                            <PinInputField />
                            <PinInputField />
                            <PinInputField />
                            <PinInputField />
                          </PinInput>
                        </HStack>
                      )}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Confirme sua matrícula: </FormLabel>
                    <Controller
                      name="confirmMatricula"
                      control={control}
                      rules={{
                        required: 'Matrícula obrigatória',
                        minLength: {
                          value: 8,
                          message: 'Matrícula deve conter 8 números',
                        },
                        maxLength: {
                          value: 8,
                          message: 'Matrícula deve conter 8 números',
                        },
                      }}
                      render={({ field }) => (
                        <HStack>
                          <PinInput
                            size="lg"
                            focusBorderColor="green.500"
                            placeholder=""
                            {...field}
                          >
                            <PinInputField />
                            <PinInputField />
                            <PinInputField />
                            <PinInputField />
                            <PinInputField />
                            <PinInputField />
                            <PinInputField />
                            <PinInputField />
                          </PinInput>
                        </HStack>
                      )}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Email: </FormLabel>
                    <Controller
                      name="email"
                      control={control}
                      rules={{
                        required: true,
                      }}
                      render={({ field }) => (
                        <Input
                          rounded="3xl"
                          focusBorderColor={green}
                          type="email"
                          isRequired
                          {...field}
                        />
                      )}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Confirmar email: </FormLabel>
                    <Controller
                      name="confirmEmail"
                      control={control}
                      rules={{
                        required: true,
                      }}
                      render={({ field }) => (
                        <Input
                          rounded="3xl"
                          focusBorderColor={green}
                          type="email"
                          isRequired
                          {...field}
                        />
                      )}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Turma: </FormLabel>
                    <Controller
                      name="turma"
                      control={control}
                      rules={{
                        required: true,
                      }}
                      render={({ field }) => (
                        <Input
                          as={InputMask as As<any>}
                          mask="MED: 99"
                          type="tel"
                          rounded="3xl"
                          focusBorderColor={green}
                          {...field}
                        />
                      )}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Nome completo: </FormLabel>
                    <Controller
                      name="nome"
                      control={control}
                      rules={{
                        required: true,
                      }}
                      render={({ field }) => (
                        <Input
                          rounded="3xl"
                          focusBorderColor={green}
                          {...field}
                        />
                      )}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Apelido: </FormLabel>
                    <Controller
                      name="apelido"
                      control={control}
                      rules={{
                        required: true,
                      }}
                      render={({ field }) => (
                        <Input
                          rounded="3xl"
                          focusBorderColor={green}
                          {...field}
                        />
                      )}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Data de nascimento: </FormLabel>
                    <Controller
                      name="dataNascimento"
                      control={control}
                      rules={{
                        required: true,
                      }}
                      render={({ field }) => (
                        <Input
                          rounded="3xl"
                          focusBorderColor={green}
                          type={'date'}
                          {...field}
                        />
                      )}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Whatsapp: </FormLabel>
                    <Controller
                      name="whatsapp"
                      control={control}
                      rules={{
                        required: true,
                      }}
                      render={({ field }) => (
                        <Input
                          as={InputMask as As<any>}
                          mask="(99) 99999-9999"
                          type="tel"
                          rounded="3xl"
                          focusBorderColor={green}
                          {...field}
                        />
                      )}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>CPF: </FormLabel>

                    <Controller
                      name="cpf"
                      control={control}
                      rules={{
                        required: true,
                      }}
                      render={({ field }) => (
                        <Input
                          as={InputMask as As<any>}
                          mask="999.999.999-99"
                          rounded="3xl"
                          focusBorderColor={green}
                          {...field}
                        />
                      )}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>RG: </FormLabel>

                    <Controller
                      name="rg"
                      control={control}
                      rules={{
                        required: true,
                      }}
                      render={({ field }) => (
                        <Input
                          rounded="3xl"
                          focusBorderColor={green}
                          {...field}
                        />
                      )}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Foto: </FormLabel>

                    <Controller
                      name="avatar"
                      control={control}
                      rules={{
                        required: true,
                      }}
                      render={({ field }) => (
                        <Input
                          pt={1}
                          type="file"
                          rounded="3xl"
                          focusBorderColor={green}
                          {...field}
                        />
                      )}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>PIN: </FormLabel>
                    <Controller
                      name="pin"
                      control={control}
                      rules={{
                        required: 'PIN obrigatório',
                        minLength: {
                          value: 6,
                          message: 'PIN deve conter 6 números',
                        },
                        maxLength: {
                          value: 6,
                          message: 'PIN deve conter 6 números',
                        },
                      }}
                      render={({ field }) => (
                        <HStack>
                          <PinInput
                            size="lg"
                            focusBorderColor="green.500"
                            mask
                            {...field}
                          >
                            <PinInputField />
                            <PinInputField />
                            <PinInputField />
                            <PinInputField />
                            <PinInputField />
                            <PinInputField />
                          </PinInput>
                        </HStack>
                      )}
                    />

                    <FormHelperText>
                      Escolha um PIN de 6 números.
                    </FormHelperText>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Confirmar PIN: </FormLabel>
                    <Controller
                      name="confirmPin"
                      control={control}
                      rules={{
                        required: 'PIN obrigatório',
                        minLength: {
                          value: 6,
                          message: 'PIN deve conter 6 números',
                        },
                        maxLength: {
                          value: 6,
                          message: 'PIN deve conter 6 números',
                        },
                      }}
                      render={({ field }) => (
                        <HStack>
                          <PinInput
                            size="lg"
                            focusBorderColor="green.500"
                            mask
                            {...field}
                          >
                            <PinInputField />
                            <PinInputField />
                            <PinInputField />
                            <PinInputField />
                            <PinInputField />
                            <PinInputField />
                          </PinInput>
                        </HStack>
                      )}
                    />
                  </FormControl>
                  <Text textAlign="center" fontSize="sm" color="red.500">
                    {error && error.message}
                  </Text>
                </Stack>
                <Stack mt={8}>
                  <CustomButton type="submit" isLoading={loading}>
                    Cadastrar
                  </CustomButton>
                  <CustomButton colorScheme="gray" onClick={handleClose}>
                    Fechar
                  </CustomButton>
                </Stack>
              </form>
            </Card>
          </Layout>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
