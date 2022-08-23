import {
  Box,
  Center,
  HStack,
  Heading,
  SimpleGrid,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';
import { Card, Layout } from '@/components/templates';
import { CustomButton, PageHeading } from '@/components/atoms';
import { SubmitHandler, useForm } from 'react-hook-form';
import { gql, useMutation } from '@apollo/client';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { AuthContext } from '@/contexts/AuthContext';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import { MdSend } from 'react-icons/md';
import { parseCookies } from 'nookies';
import { useRouter } from 'next/router';

// const CREATE_INTERMED_PROFILE = gql`
//   mutation createIntermedProfile(
//     $avatar: Upload!
//     $enroll: Upload!
//     $vaccineCard: Upload!
//     $nickname: String!
//   ) {
//     createIntermedProfile(
//       avatar: $avatar
//       enroll: $enroll
//       vaccineCard: $vaccineCard
//       nickname: $nickname
//     ) {
//       ok
//     }
//   }
// `;
const CREATE_PAYMENT = gql`
  mutation createPayment(
    $amount: Float!
    $methodId: ID!
    $description: String!
    $atttachmentTitle: String
    $attachment: Upload
  ) {
    createPayment(
      amount: $amount
      methodId: $methodId
      description: $description
      atttachmentTitle: $atttachmentTitle
      attachment: $attachment
    ) {
      payment {
        id
      }
      paymentCreated
    }
  }
`;
const CHECKOUT_PAYMENT = gql`
  mutation checkoutPayment($paymentId: ID!, $items: [ItemObject]!) {
    checkoutPayment(paymentId: $paymentId, items: $items) {
      checkoutUrl
    }
  }
`;

// type Step1InputData = {
//   nickname: string;
//   avatar: string;
//   vaccineCard: string;
//   enroll: string;
// };

type Step2InputData = {
  attachments: string;
};

function Intermed() {
  // const { green } = useContext(ColorContext);
  const [pause] = useState(false);
  const toast = useToast();
  const price = useMemo(() => {
    const today = new Date();
    const lotes = [
      {
        // 0 - Primeiro lote
        atletaOuRitmista: 190,
        socio: 210,
        naoSocio: 260,
      },

      {
        // 1 - Segundo lote
        atletaOuRitmista: 240,
        socio: 270,
        naoSocio: 330,
      },

      {
        // 2 - Terceiro lote
        atletaOuRitmista: 260,
        socio: 290,
        naoSocio: 350,
      },
      {
        // 3 - Quarto lote
        atletaOuRitmista: 285,
        socio: 310,
        naoSocio: 380,
      },
      {
        // 4 - Quinto lote
        atletaOuRitmista: 300,
        socio: 350,
        naoSocio: 410,
      },
      {
        // 5 - Sexto lote
        atletaOuRitmista: 0,
        socio: 0,
        naoSocio: 0,
      },
    ];

    if (
      new Date(2022, 0, 1) < today &&
      today <= new Date(2022, 5, 26, 23, 59, 59)
    ) {
      return lotes[0];
    } else if (
      new Date(2022, 5, 28, 0, 0, 0) < today &&
      today <= new Date(2022, 6, 17, 23, 59, 59)
    ) {
      return lotes[1];
    } else if (
      new Date(2022, 6, 19, 0, 0, 0) < today &&
      today <= new Date(2022, 7, 21, 23, 59, 59)
    ) {
      return lotes[2];
    } else if (
      new Date(2022, 7, 23, 0, 0, 0) < today &&
      today <= new Date(2022, 8, 18, 23, 59, 59)
    ) {
      return lotes[3];
    } else if (
      new Date(2022, 8, 18, 0, 0, 0) < today &&
      today <= new Date(2022, 9, 16, 23, 59, 59)
    ) {
      return lotes[4];
    } else return lotes[5];
  }, []);
  const router = useRouter();

  const { isAuthenticated, user, token } = useContext(AuthContext);

  // const [createIntermedProfile, { loading: createIntermedProfileLoading }] =
  //   useMutation(CREATE_INTERMED_PROFILE, {
  //     context: {
  //       headers: {
  //         authorization: `JWT ${token}`,
  //       },
  //     },
  //   });
  const [createPayment, { loading }] = useMutation(CREATE_PAYMENT, {
    context: {
      headers: {
        authorization: `JWT ${token}`,
      },
    },
  });
  const [checkoutPayment] = useMutation(CHECKOUT_PAYMENT, {
    context: {
      headers: {
        authorization: `JWT ${token}`,
      },
    },
  });

  // const step1Form = useForm<Step1InputData>();
  const step2Form = useForm<Step2InputData>();

  const onSubmit: SubmitHandler<Step2InputData> = useCallback(async () => {
    const amount = user?.member.isFirstTeamer
      ? price.atletaOuRitmista
      : user?.member.hasActiveMembership &&
        user.member.activeMembership?.membershipPlan.title !== 'MENSAL'
      ? price.socio
      : price.naoSocio;

    await createPayment({
      variables: {
        amount,
        methodId: 'UGF5bWVudE1ldGhvZE5vZGU6NQ==',
        description: 'Pagamento VI Intermed Nordeste',
      },
    }).then(async ({ data: { createPayment } }) => {
      if (createPayment.paymentCreated) {
        toast({
          title: 'Dados enviados',
          description: 'Você será redirecionado para o pagamento em instantes.',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top-left',
        });
      } else {
        toast({
          title: 'Dados já recebidos',
          status: 'info',
          duration: 2500,
          isClosable: true,
          position: 'top-left',
        });
      }

      await checkoutPayment({
        variables: {
          paymentId: createPayment.payment.id,
          items: [
            {
              name: 'VI INTERMED NORDESTE',
              quantity: 1,
              amount: amount * 100,
            },
          ],
        },
      }).then(({ data: { checkoutPayment: checkoutPaymentData } }) => {
        router.push(checkoutPaymentData.checkoutUrl);
      });
    });
  }, [price, user, createPayment, checkoutPayment, toast, router]);

  // const handleCreateIntermedProfile: SubmitHandler<Step1InputData> =
  //   useCallback(
  //     async ({ avatar, enroll, vaccineCard, nickname }) => {
  //       await createIntermedProfile({
  //         variables: {
  //           nickname,
  //           avatar: avatar[0],
  //           enroll: enroll[0],
  //           vaccineCard: vaccineCard[0],
  //         },
  //       })
  //         .then(({ data: { createIntermedProfile } }) => {
  //           if (createIntermedProfile.ok) {
  //             toast({
  //               title: 'Dados salvos com sucesso',
  //               description:
  //                 'Seus dados foram enviados à organizadora, efetue o pagamento para confirmar sua inscrição',
  //               status: 'success',
  //               duration: 2500,
  //               isClosable: true,
  //               position: 'top-left',
  //             });
  //           }
  //         })
  //         .catch((err) => {
  //           toast({
  //             title: 'Erro ao salvar dados',
  //             description: err.message,
  //             status: 'error',
  //             duration: 2500,
  //             isClosable: true,
  //             position: 'top-left',
  //           });
  //         });
  //     },
  //     [createIntermedProfile, toast],
  //   );

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(`/login?after=${router.asPath}`);
    }
  }, [isAuthenticated, router]);

  return (
    <Layout
      title="VI INTERMED NE"
      description="O VI INTERMED NORDESTE está chegando e você não pode perder a chance de curtir a Terra da Luz junto com a Fúria. Em outubro, a Fúria vai invadir Fortaleza!"
      keywords="intermed, fortaleza, furia, ceará, medicina, aaafuria"
    >
      <PageHeading>VI Intermed Nordeste</PageHeading>

      {pause ? (
        <Text textAlign={'center'}>
          Inscrições pausadas. Tente novamente mais tarde.
        </Text>
      ) : price.naoSocio === 0 ? (
        <Text textAlign={'center'}>Lote não iniciado</Text>
      ) : (
        <SimpleGrid columns={1} spacing={2}>
          <Card>
            <Stack>
              <Heading size="md" as="h2" my={4}>
                1º PASSO: FAÇA A SUA INSCRIÇÃO
              </Heading>
              <CustomButton
                onClick={() =>
                  window.open(
                    'http://www.intermednordeste.com/login',
                    'targetWindow',
                    `toolbar=no,
                    target=_blank,
                    status=no,
                    menubar=no,    
                    scrollbars=yes,
                    resizable=yes,
                    width=720px,
                    height=1280px`,
                  )
                }
              >
                Inscreva-se
              </CustomButton>
              {/* <form
                onSubmit={step1Form.handleSubmit(handleCreateIntermedProfile)}
              >
                <Stack>
                  <FormControl isRequired>
                    <FormLabel>Apelido no crachá: </FormLabel>
                    <Input
                      {...step1Form.register('nickname')}
                      isRequired
                      rounded="3xl"
                      focusBorderColor={green}
                    />
                    <FormHelperText>
                      Nome a ser impresso no crachá
                    </FormHelperText>
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Foto de rosto: </FormLabel>
                    <Input
                      {...step1Form.register('avatar')}
                      pt={1}
                      type="file"
                      isRequired
                      rounded="3xl"
                      focusBorderColor={green}
                    />
                    <FormHelperText>
                      Foto de frente, sem boné ou óculos escuro e em ambiente
                      bem iluminado
                    </FormHelperText>
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Comprovante de vacinação: </FormLabel>
                    <Input
                      {...step1Form.register('vaccineCard')}
                      pt={1}
                      type="file"
                      isRequired
                      rounded="3xl"
                      focusBorderColor={green}
                    />
                    <FormHelperText>
                      Mínimo de 03 doses, de acordo com as regras sanitárias
                      locais.
                    </FormHelperText>
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Comprovante de matrícula: </FormLabel>
                    <Input
                      {...step1Form.register('enroll')}
                      pt={1}
                      type="file"
                      isRequired
                      rounded="3xl"
                      focusBorderColor={green}
                    />
                  </FormControl>
                  <Card>
                    <Text>OBSERVAÇÕES IMPORTANTES:</Text>
                    <UnorderedList>
                      <ListItem>
                        EM CASO DE ADIAMENTO DO EVENTO, POR CAUSA DA PANDEMIA, A
                        INSCRIÇÃO SERÁ ADIADA PARA O PRÓXIMO EVENTO DE
                        ORGANIZAÇÃO DA LINE.
                      </ListItem>
                      <ListItem>
                        PARA COMPARECER AO O EVENTO, O PARTICIPANTE DEVE TER
                        COMPROVANTE COM 3 DOSES DE VACINA PARA COVID-19. ALÉM
                        DISSO, NÃO PODE APRESENTAR SINTOMAS, COMO FEBRE E TOSSE
                        NAS ULTIMAS 24H.
                      </ListItem>
                      <ListItem>
                        A ATLÉTICA ORGANIZADORA PREZA PELO BEM ESTAR DOS
                        PARTICIPANTES DO EVENTO, COM TOLERÂNCIA ZERO PARA
                        AGRESSÕES FÍSICAS, QUALQUER MANIFESTAÇÃO DE RACISMO,
                        HOMOFOBIA OU QUALQUER OUTRO TIPO DE PRECONCEITO, SENDO O
                        ATUANTE PUNIDO COM EXPULSÃO DO EVENTO E A ATLÉTICA PELÁ
                        QUAL O MESMO ESTAR INSCRITO PASSÍVEL DE PUNIÇÃO.
                      </ListItem>
                      <ListItem>
                        AO CONFIRMAR SUA INSCRIÇÃO VOCÊ ESTAR DE ACORDO COM OS
                        TERMOS ACIMA.
                      </ListItem>
                    </UnorderedList>
                  </Card>
                  <CustomButton
                    type="submit"
                    isLoading={createIntermedProfileLoading}
                  >
                    Enviar
                  </CustomButton>
                </Stack>
              </form> */}
            </Stack>
          </Card>

          <Card>
            <Heading size="md" as="h2" my={4} mb={10}>
              2º PASSO: EFETUE O PAGAMENTO
            </Heading>
            <Center mb={4}>
              <Box rounded="md" overflow={'hidden'}>
                <Image
                  src={'/lote-intermed.jpeg'}
                  height="400px"
                  width="400px"
                  alt={'lote-intermed'}
                />
              </Box>
            </Center>
            <Stack>
              <form onSubmit={step2Form.handleSubmit(onSubmit)}>
                <Stack>
                  <Box>
                    <HStack justify={'space-between'}>
                      <Text>Categoria: </Text>
                      <Text textAlign={'right'}>
                        {user?.member.isFirstTeamer ? (
                          'Atleta / Ritmista'
                        ) : user?.member.hasActiveMembership &&
                          user.member.activeMembership?.membershipPlan.title !==
                            'MENSAL' ? (
                          'Sócio'
                        ) : (
                          <HStack align={'flex-end'}>
                            <Text>Não sócio / Sócio mensal</Text>
                            <CustomButton
                              size="sm"
                              maxW="80px"
                              onClick={() => router.push('/seja-socio')}
                            >
                              Seja sócio
                            </CustomButton>
                          </HStack>
                        )}
                      </Text>
                    </HStack>
                    <HStack justify={'space-between'}>
                      <Text>Total: </Text>
                      <Text
                        fontWeight={'bold'}
                        fontSize="2xl"
                        textAlign={'right'}
                      >
                        R$
                        {user?.member.isFirstTeamer
                          ? price.atletaOuRitmista
                          : user?.member.hasActiveMembership &&
                            user.member.activeMembership?.membershipPlan
                              .title !== 'MENSAL'
                          ? price.socio
                          : price.naoSocio}
                      </Text>
                    </HStack>
                  </Box>
                  <Card px={4}>
                    <Stack>
                      <CustomButton
                        leftIcon={<MdSend size="20px" />}
                        type="submit"
                        variant={'solid'}
                        isLoading={loading}
                      >
                        Pagar agora
                      </CustomButton>
                    </Stack>
                  </Card>
                </Stack>
              </form>
            </Stack>
          </Card>
        </SimpleGrid>
      )}
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ['aaafuriaToken']: token } = parseCookies(ctx);

  if (!token) {
    return {
      redirect: {
        destination: `/login?after=${ctx.resolvedUrl}`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      token,
    },
  };
};

export default Intermed;
