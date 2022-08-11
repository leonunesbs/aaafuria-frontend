import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Center,
  Code,
  Stack,
  Text,
  useClipboard,
} from '@chakra-ui/react';
import { CustomButton, CustomIconButton } from '.';
import { MdCheck, MdCopyAll, MdPayment } from 'react-icons/md';
import { PixStaticObject, createStaticPix } from 'pix-utils';
import { gql, useMutation } from '@apollo/client';
import { useCallback, useMemo } from 'react';

import { Url } from 'url';
import { useRouter } from 'next/router';

const CHECKOUT_URL = gql`
  mutation getCheckoutUrl($paymentId: ID!) {
    checkoutUrl(paymentId: $paymentId) {
      url
    }
  }
`;

export interface PaymentInstructionsProps {
  payment: {
    id?: string;
    amount?: string;
    method?: string;
  };
}

export function PaymentInstructions({ payment }: PaymentInstructionsProps) {
  const router = useRouter();
  const pix = useMemo(() => {
    if (payment) {
      return createStaticPix({
        merchantName: 'Alberico S S A Santana',
        merchantCity: 'Teresina',
        pixKey: 'pix@aaafuria.site',
        infoAdicional: payment.id?.replace(/[^a-z0-9]/gi, '') ?? '',
        transactionAmount: parseFloat(payment.amount as string) ?? 0,
        txid: '',
      }) as PixStaticObject;
    }
  }, [payment]);
  const { hasCopied, onCopy } = useClipboard(pix?.toBRCode() as string);

  const [checkoutUrl, { loading: checkoutUrlLoading }] = useMutation<{
    checkoutUrl: {
      url: Url;
    };
  }>(CHECKOUT_URL, {
    variables: {
      paymentId: payment.id as string,
    },
  });
  const handleCheckoutUrl = useCallback(async () => {
    checkoutUrl().then(({ data }) => {
      router.push(data?.checkoutUrl.url as Url);
    });
  }, [checkoutUrl, router]);
  return (
    <Center>
      {payment.method === 'PIX' ? (
        <Alert
          status="info"
          variant="subtle"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          rounded="md"
        >
          <AlertIcon boxSize="40px" mr={0} />
          <AlertTitle mt={4} mb={1} fontSize="lg">
            Aguardando comprovante
          </AlertTitle>
          <Stack align={'center'}>
            <AlertDescription maxWidth="sm">
              Copie o código PIX abaixo e pague no aplicativo do seu banco.
            </AlertDescription>
            <Code
              overflowWrap="anywhere"
              rounded={'md'}
              position="relative"
              maxW={['xs', 'lg']}
            >
              {pix?.toBRCode()}
              <CustomIconButton
                position="absolute"
                top={1}
                right={1}
                size="xs"
                variant={'solid'}
                aria-label="copiar"
                opacity={0.8}
                icon={
                  hasCopied ? (
                    <MdCheck size="15px" />
                  ) : (
                    <MdCopyAll size="15px" />
                  )
                }
                onClick={onCopy}
              />
            </Code>
            <Text fontStyle={'italic'}>
              Chave PIX: <strong>pix@aaafuria.site</strong>
            </Text>
          </Stack>
        </Alert>
      ) : (
        <Alert
          status="info"
          variant="subtle"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          rounded="md"
        >
          <AlertIcon boxSize="40px" mr={0} />
          <AlertTitle mt={4} mb={1} fontSize="lg">
            Aguardando pagamento
          </AlertTitle>
          <Stack align={'center'}>
            <AlertDescription maxWidth="sm">
              Clique no botão abaixo para ser encaminhado para o pagamento.
            </AlertDescription>

            <CustomButton
              onClick={handleCheckoutUrl}
              variant="solid"
              leftIcon={<MdPayment size="20px" />}
              isLoading={checkoutUrlLoading}
            >
              Ir ao pagamento
            </CustomButton>
          </Stack>
        </Alert>
      )}
    </Center>
  );
}
