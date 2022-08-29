import * as gtag from 'libs/gtag';

import { CustomButton, CustomLink, PageHeading } from '@/components/atoms';
import { Card, Layout } from '@/components/templates';
import { AuthContext, ColorContext } from '@/contexts';
import { gql, useQuery } from '@apollo/client';
import {
  Box,
  Center,
  chakra,
  Collapse,
  FormControl,
  FormLabel,
  HStack,
  PinInput,
  PinInputField,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import { SignUpDrawer } from '@/components/organisms';
import NextImage from 'next/image';
import { useRouter } from 'next/router';
import { AiFillHome } from 'react-icons/ai';
import { MdLogin } from 'react-icons/md';

const CHECK_MEMBER = gql`
  query checkMember($matricula: String) {
    checkMember(registration: $matricula)
  }
`;

type Inputs = {
  matricula: string;
  pin: string;
};

export default function Login() {
  const router = useRouter();
  const toast = useToast();
  const { after }: { after?: string } = router.query;
  const { signIn } = useContext(AuthContext);
  const { green } = useContext(ColorContext);
  const [login, setLogin] = useState(false);

  const pinInputFieldRef = useRef<HTMLInputElement>(null);

  const calango = useColorModeValue(
    '/calango-verde.png',
    '/calango-verde-b.png',
  );
  const cadastroDisclosure = useDisclosure();

  const ChakraNextImage = useMemo(() => chakra(NextImage), []);

  const { refetch } = useQuery<{ checkMember: boolean }>(CHECK_MEMBER, {
    fetchPolicy: 'no-cache',
  });

  const {
    getValues,
    handleSubmit,
    setError,
    clearErrors,
    control,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>();

  const checkMatricula = useCallback(
    async (matricula: string) => {
      await refetch({ matricula }).then(({ data: { checkMember } }) => {
        if (checkMember) {
          setLogin(true);
          return pinInputFieldRef.current?.focus();
        } else {
          toast({
            description: 'Matrícula não encontrada. Cadastre-se',
            status: 'info',
            duration: 2500,
            isClosable: true,
            position: 'top-left',
          });
          router.push(
            `/login?signup=${matricula}${after ? `&after=${after}` : ''}`,
          );
          cadastroDisclosure.onOpen();
        }
      });
    },
    [after, cadastroDisclosure, refetch, router, toast],
  );

  const onSubmit: SubmitHandler<Inputs> = useCallback(
    async ({ matricula, pin }) => {
      if (!login) {
        return checkMatricula(matricula);
      }
      await signIn({
        matricula,
        pin,
        redirectUrl: after,
      })
        .then(({ tokenAuth }) => {
          toast({
            description: `Olá ${tokenAuth.user.member.nickname}, bem vind@ de volta!`,
            status: 'success',
            duration: 2500,
            isClosable: true,
            position: 'top-left',
          });
          gtag.event({
            action: 'login',
            category: 'engagement',
            label: matricula,
            value: 1,
          });
        })
        .catch(({ message }) => {
          setError('matricula', { message });
        });
    },
    [after, checkMatricula, login, setError, signIn, toast],
  );

  useEffect(() => {
    if (getValues().matricula?.length < 8) {
      setLogin(false);
    }
  }, [getValues]);

  return (
    <Layout
      title="Entrar"
      description="Acesso à plataforma de Sócios da @aaafuria!"
      isHeaded={false}
      isFooted={false}
    >
      <Box maxW="md" mx="auto">
        <Center mb={6}>
          <Box boxSize="250px" position="relative">
            <ChakraNextImage
              placeholder="blur"
              layout="fill"
              objectFit="cover"
              src={calango}
              blurDataURL={calango}
              quality={1}
              alt="logo"
              mx="auto"
              mb={{ base: '8', md: '12' }}
              draggable={false}
            />
          </Box>
        </Center>
        <PageHeading>Acesse a plataforma</PageHeading>
        <Card>
          <form onSubmit={handleSubmit(onSubmit)} name="entrarForm">
            <Stack spacing={4}>
              <FormControl>
                <FormLabel htmlFor="matricula">Matrícula: </FormLabel>
                <Controller
                  name="matricula"
                  control={control}
                  rules={{
                    required: 'Insira sua matrícula',
                    minLength: {
                      value: 8,
                      message: 'A Matrícula deve conter 8 números',
                    },
                    maxLength: {
                      value: 8,
                      message: 'A Matrícula deve conter 8 números',
                    },
                    onChange: () => {
                      clearErrors();
                    },
                  }}
                  render={({ field }) => (
                    <HStack>
                      <PinInput
                        type="number"
                        size="lg"
                        focusBorderColor={green}
                        placeholder=""
                        autoFocus
                        onComplete={checkMatricula}
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
              <Collapse in={login} animateOpacity unmountOnExit>
                <FormControl>
                  <FormLabel htmlFor="pin">PIN: </FormLabel>
                  <Controller
                    name="pin"
                    control={control}
                    rules={{
                      required: 'Insira o seu PIN',
                      minLength: {
                        value: 6,
                        message: 'O PIN deve conter 6 números',
                      },
                      maxLength: {
                        value: 6,
                        message: 'O PIN deve conter 6 números',
                      },
                      onChange: () => {
                        clearErrors();
                      },
                    }}
                    render={({ field }) => (
                      <HStack>
                        <PinInput
                          type="number"
                          size="lg"
                          mask
                          placeholder=""
                          focusBorderColor={green}
                          onComplete={() => handleSubmit(onSubmit)()}
                          {...field}
                        >
                          <PinInputField ref={pinInputFieldRef} />
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
              </Collapse>
              <CustomLink
                href={`${process.env.DIRETORIA_DOMAIN}/accounts/password_reset/`}
                chakraLinkProps={{
                  color: green,
                  textAlign: 'right',
                  mt: 4,
                }}
              >
                Esqueceu o seu PIN?
              </CustomLink>
              {errors.matricula && (
                <Text textAlign="center" textColor="gray.500">
                  <i>{errors.matricula?.message}</i>
                </Text>
              )}
              {errors.pin && (
                <Text textAlign="center" textColor="gray.500">
                  <i>{errors.pin?.message}</i>
                </Text>
              )}

              <Stack>
                <CustomButton
                  leftIcon={<MdLogin size="20px" />}
                  mt={4}
                  type="submit"
                  isLoading={isSubmitting}
                >
                  Entrar
                </CustomButton>
                <CustomButton
                  leftIcon={<AiFillHome size="20px" />}
                  colorScheme="gray"
                  onClick={() => router.push('/')}
                >
                  Início
                </CustomButton>
              </Stack>
            </Stack>
          </form>
        </Card>
        <Center mt={2}>
          <Text as="i" textAlign="center" maxW="md" fontWeight="light">
            *Em caso de erro atualize a página.
          </Text>
        </Center>
      </Box>
      <SignUpDrawer
        isOpen={cadastroDisclosure.isOpen}
        onClose={cadastroDisclosure.onClose}
      />
    </Layout>
  );
}
