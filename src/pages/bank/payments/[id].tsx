import {
  Alert,
  AlertIcon,
  Badge,
  Box,
  Collapse,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Input,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { Card, Layout } from '@/components/templates';
import {
  CustomButton,
  PageHeading,
  PaymentInstructions,
} from '@/components/atoms';
import { MdAdd, MdDelete, MdLink, MdSave } from 'react-icons/md';
import { SubmitHandler, useForm } from 'react-hook-form';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useCallback, useContext } from 'react';

import { AuthContext } from '@/contexts/AuthContext';
import { ColorContext } from '@/contexts/ColorContext';
import { CustomIconButton } from '@/components/atoms/CustomIconButton';
import { FaWhatsapp } from 'react-icons/fa';
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';
import { useRouter } from 'next/router';

const GET_PAYMENT = gql`
  query getPayment($id: ID) {
    payment(id: $id) {
      id
      user {
        member {
          name
          registration
          group
          hasActiveMembership
          whatsappUrl
        }
      }
      amount
      currency
      method
      description
      status
      createdAt
      updatedAt
      paid
      expired
      attachments {
        edges {
          node {
            id
            title
            content
            file
            createdAt
            updatedAt
          }
        }
      }
    }
  }
`;

const CONFIRM_PAYMENT = gql`
  mutation confirmPayment($paymentId: ID!, $description: String!) {
    confirmPayment(paymentId: $paymentId, description: $description) {
      ok
    }
  }
`;

const CANCEL_PAYMENT = gql`
  mutation cancelPayment($paymentId: ID!, $description: String!) {
    cancelPayment(paymentId: $paymentId, description: $description) {
      ok
    }
  }
`;

const CREATE_ATTACHMENT = gql`
  mutation createAttachment($paymentId: ID!, $title: String!, $file: Upload!) {
    createAttachment(paymentId: $paymentId, title: $title, file: $file) {
      ok
    }
  }
`;

const DELETE_ATTACHMENT = gql`
  mutation deleteAttachment($attachmentId: ID!) {
    deleteAttachment(attachmentId: $attachmentId) {
      ok
    }
  }
`;

type PaymentData = {
  payment: {
    id: string;
    user: {
      member: {
        name: string;
        registration: string;
        group: string;
        hasActiveMembership: boolean;
        whatsappUrl: string;
      };
    };
    amount: string;
    currency: number;
    method: string;
    description: string;
    status: string;
    paid: boolean;
    expired: boolean;
    createdAt: string;
    updatedAt: string;
    attachments: {
      edges: {
        node: {
          id: string;
          title: string;
          content: string;
          file: string;
          createdAt: string;
          updatedAt: string;
        };
      }[];
    };
  };
};

type AttachmentForm = {
  title: string;
  file: string;
};

function Payment() {
  const toast = useToast();
  const router = useRouter();
  const { green } = useContext(ColorContext);
  const { token, user } = useContext(AuthContext);
  const { onToggle: toggleAttach, isOpen: attachOpen } = useDisclosure();
  const { id } = router.query;

  const attachmentForm = useForm<AttachmentForm>();

  const { data, refetch } = useQuery<PaymentData>(GET_PAYMENT, {
    variables: {
      id: id as string,
    },
    context: {
      headers: {
        authorization: `JWT ${token}`,
      },
    },
  });

  const [cancelPayment, { loading: cancelPaymentLoading }] = useMutation(
    CANCEL_PAYMENT,
    {
      context: {
        headers: {
          authorization: `JWT ${token}`,
        },
      },
    },
  );
  const [confirmPayment, { loading: confirmPaymentLoading }] = useMutation(
    CONFIRM_PAYMENT,
    {
      context: {
        headers: {
          authorization: `JWT ${token}`,
        },
      },
    },
  );

  const [createAttachment, { loading: createAttachmentLoading }] = useMutation(
    CREATE_ATTACHMENT,
    {
      context: {
        headers: {
          authorization: `JWT ${token}`,
        },
      },
    },
  );

  const [deleteAttachment] = useMutation(DELETE_ATTACHMENT, {
    context: {
      headers: {
        authorization: `JWT ${token}`,
      },
    },
  });

  const handleSaveAttachment: SubmitHandler<AttachmentForm> = useCallback(
    async ({ title, file }) => {
      await createAttachment({
        variables: {
          paymentId: id as string,
          title,
          file: file[0],
        },
      }).then(({ errors }) => {
        if (errors) {
          throw errors;
        }
      });
      await refetch();
      toast({
        title: 'Anexo adicionado',
        status: 'success',
        duration: 2500,
        isClosable: true,
        position: 'top-left',
      });
      toggleAttach();
    },
    [createAttachment, id, refetch, toast, toggleAttach],
  );

  const handleDeleteAttachment = useCallback(
    async (id: string) => {
      await deleteAttachment({
        variables: {
          attachmentId: id,
        },
      });
      await refetch();
      toast({
        title: 'Anexo removido',
        status: 'info',
        duration: 2500,
        isClosable: true,
        position: 'top-left',
      });
    },
    [deleteAttachment, refetch, toast],
  );

  return (
    <Layout title={data?.payment?.description as string}>
      <Box maxW="4xl" mx="auto">
        <PageHeading>Pagamento</PageHeading>
        <Card>
          {data?.payment?.status === 'PENDENTE' && (
            <>
              {data?.payment?.method === 'PIX' ? (
                data.payment?.attachments.edges.length === 0 && (
                  <Box>
                    <PaymentInstructions
                      payment={{
                        id: data?.payment?.id,
                        amount: data?.payment?.amount,
                        method: data?.payment?.method,
                      }}
                    />
                  </Box>
                )
              ) : (
                <Box>
                  <PaymentInstructions
                    payment={{
                      id: data?.payment?.id,
                      amount: data?.payment?.amount,
                      method: data?.payment?.method,
                    }}
                  />
                </Box>
              )}
            </>
          )}

          <Stack mb={10}>
            <Box>
              <Heading size="sm" my={4}>
                DADOS DO CLIENTE
              </Heading>
              <TableContainer>
                <Table size="sm">
                  <Tbody>
                    <Tr>
                      <Td>
                        <Text>Nome:</Text>
                      </Td>
                      <Td textAlign={'right'}>
                        <Text>{data?.payment?.user.member.name}</Text>
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>
                        <Text>Matrícula:</Text>
                      </Td>
                      <Td textAlign={'right'}>
                        <Text>{data?.payment?.user.member.registration}</Text>
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>
                        <Text>Turma:</Text>
                      </Td>
                      <Td textAlign={'right'}>
                        <Text>{data?.payment?.user.member.group}</Text>
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>
                        <Text>Associação:</Text>
                      </Td>
                      <Td textAlign={'right'}>
                        <Text>
                          {data?.payment?.user.member.hasActiveMembership ? (
                            <Badge colorScheme="green">Sócio Ativo</Badge>
                          ) : (
                            <Badge colorScheme="red">Sócio Inativo</Badge>
                          )}
                        </Text>
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>
                        <Text>Contato:</Text>
                      </Td>
                      <Td>
                        <HStack w="full" justify={'flex-end'}>
                          <CustomIconButton
                            aria-label="whatsapp"
                            icon={<FaWhatsapp size="20px" />}
                            size="xs"
                            onClick={() =>
                              window.open(
                                data?.payment.user.member.whatsappUrl as string,
                                '_ blank',
                              )
                            }
                          />
                        </HStack>
                      </Td>
                    </Tr>
                  </Tbody>
                </Table>
              </TableContainer>
            </Box>

            <Box>
              <Heading size="sm" my={4}>
                DETALHES DO PAGAMENTO
              </Heading>
              <TableContainer>
                <Table size="sm">
                  <Tbody>
                    <Tr>
                      <Td>
                        <Text>Identificador:</Text>
                      </Td>
                      <Td textAlign={'right'}>
                        <Text>{data?.payment?.id}</Text>
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>
                        <Text>Valor:</Text>
                      </Td>
                      <Td textAlign={'right'} isNumeric>
                        <Text>{data?.payment?.amount}</Text>
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>
                        <Text>Moeda:</Text>
                      </Td>
                      <Td textAlign={'right'}>
                        <Text>{data?.payment?.currency}</Text>
                      </Td>
                    </Tr>

                    <Tr>
                      <Td>
                        <Text>Descrição:</Text>
                      </Td>
                      <Td textAlign={'right'}>
                        <Text>{data?.payment?.description}</Text>
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>
                        <Text>Método:</Text>
                      </Td>
                      <Td textAlign={'right'}>
                        <HStack w="full" justify={'flex-end'}>
                          <Text>{data?.payment?.method}</Text>
                        </HStack>
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>
                        <Text>Status:</Text>
                      </Td>
                      <Td textAlign={'right'}>
                        <Text>{data?.payment?.status}</Text>
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>
                        <Text>Criado em:</Text>
                      </Td>
                      <Td textAlign={'right'}>
                        <Text>
                          {new Date(
                            data?.payment?.createdAt as string,
                          ).toLocaleString('pt-BR', {
                            timeStyle: 'short',
                            dateStyle: 'short',
                            timeZone: 'America/Sao_Paulo',
                          })}
                        </Text>
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>
                        <Text>Atualizado em:</Text>
                      </Td>
                      <Td textAlign={'right'}>
                        <Text>
                          {new Date(
                            data?.payment?.updatedAt as string,
                          ).toLocaleString('pt-BR', {
                            timeStyle: 'short',
                            dateStyle: 'short',
                            timeZone: 'America/Sao_Paulo',
                          })}
                        </Text>
                      </Td>
                    </Tr>
                  </Tbody>
                </Table>
              </TableContainer>
            </Box>

            <Box>
              {data?.payment?.status === 'PENDENTE' && (
                <>
                  {data?.payment?.method === 'PIX' &&
                  data.payment?.attachments.edges.length === 0 ? (
                    <Alert status="info" rounded={'md'}>
                      <AlertIcon />
                      Adicione o comprovante de pagamento aos anexos abaixo e
                      aguarde a confirmação do pagamento.
                    </Alert>
                  ) : (
                    <Alert status="success" rounded={'md'}>
                      <AlertIcon />
                      Aguarde a confirmação do pagamento.
                    </Alert>
                  )}
                </>
              )}
              <HStack w="full" justify={'space-between'}>
                <Heading size="sm" my={4}>
                  ANEXOS
                </Heading>
                <CustomIconButton
                  aria-label="anexar ao pagamento"
                  icon={<MdAdd size="20px" />}
                  onClick={toggleAttach}
                  isActive={attachOpen}
                  isDisabled={data?.payment?.status !== 'PENDENTE'}
                />
              </HStack>
              <form
                onSubmit={attachmentForm.handleSubmit(handleSaveAttachment)}
              >
                <Collapse in={attachOpen}>
                  <Stack>
                    <Text>Adicionar anexo</Text>
                    <Stack direction={['column', 'row']}>
                      <FormControl isRequired>
                        <FormLabel fontSize={'sm'}>Título</FormLabel>
                        <Input
                          {...attachmentForm.register('title')}
                          placeholder="Título do anexo"
                          isRequired
                          rounded="3xl"
                          focusBorderColor={green}
                        />
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel fontSize={'sm'}>Anexo</FormLabel>
                        <Input
                          {...attachmentForm.register('file')}
                          isRequired
                          type="file"
                          rounded="3xl"
                          focusBorderColor={green}
                          pt={1}
                        />
                      </FormControl>
                    </Stack>
                    <CustomButton
                      type="submit"
                      leftIcon={<MdSave size="20px" />}
                      isLoading={createAttachmentLoading}
                    >
                      Salvar
                    </CustomButton>
                  </Stack>
                </Collapse>
              </form>
              <TableContainer>
                <Table size="sm">
                  <Thead>
                    <Tr>
                      <Th />
                      <Th />
                      <Th />
                    </Tr>
                  </Thead>
                  <Tbody>
                    {data?.payment?.attachments.edges.map(({ node }) => (
                      <Tr key={node.id}>
                        <Td>
                          <Text>{node.title}</Text>
                        </Td>
                        <Td>
                          <Text>{node.content}</Text>
                        </Td>
                        <Td>
                          <HStack w="full" justify={'flex-end'}>
                            <CustomIconButton
                              onClick={() => window.open(node.file, '_blank')}
                              aria-label={node.title}
                              icon={<MdLink size="20px" />}
                            />
                            <CustomIconButton
                              isDisabled={!user?.isStaff}
                              onClick={() => handleDeleteAttachment(node.id)}
                              aria-label={node.title}
                              colorScheme="red"
                              icon={<MdDelete size="20px" />}
                            />
                          </HStack>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </Box>
          </Stack>

          <Stack>
            {user?.isStaff && (
              <Stack>
                <HStack>
                  {!data?.payment?.paid && !data?.payment?.expired && (
                    <CustomButton
                      colorScheme="red"
                      isLoading={cancelPaymentLoading}
                      onClick={async () => {
                        await cancelPayment({
                          variables: {
                            paymentId: data?.payment?.id,
                            description: data?.payment.description,
                          },
                        }).then(() => {
                          refetch();
                        });
                      }}
                    >
                      Invalidar
                    </CustomButton>
                  )}
                  {!data?.payment?.paid && !data?.payment?.expired && (
                    <CustomButton
                      variant={'solid'}
                      isLoading={confirmPaymentLoading}
                      onClick={async () => {
                        await confirmPayment({
                          variables: {
                            paymentId: data?.payment?.id,
                            description: data?.payment.description,
                          },
                        }).then(({ errors }) => {
                          if (errors) {
                            return alert(errors[0].message);
                          }
                          refetch();
                        });
                      }}
                    >
                      Validar
                    </CustomButton>
                  )}
                </HStack>
                <CustomButton
                  colorScheme="yellow"
                  onClick={() => router.push('/admin/dashboard?panel=finances')}
                >
                  Gerenciar pagamentos
                </CustomButton>
              </Stack>
            )}
          </Stack>
        </Card>
      </Box>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ['aaafuriaToken']: token } = parseCookies(ctx);

  if (!token) {
    return {
      redirect: {
        destination: `/entrar?after=${ctx.resolvedUrl}`,
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default Payment;
