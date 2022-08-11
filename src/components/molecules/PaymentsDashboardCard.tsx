import { Box, HStack, Heading } from '@chakra-ui/react';
import { ReactNode, useContext } from 'react';

import { AddPaymentDrawer } from '../organisms';
import { Card } from '../templates';
import { ColorContext } from '@/contexts/ColorContext';
import { PaymentsTable } from '../atoms';

interface PaymentsDashboardCardProps {
  children?: ReactNode;
}

export function PaymentsDashboardCard({}: PaymentsDashboardCardProps) {
  const { green } = useContext(ColorContext);
  return (
    <Card>
      <HStack mb={4} w="full" justify={'space-between'}>
        <Box>
          <Heading size="md" color={green}>
            PAGAMENTOS
          </Heading>
        </Box>
        <HStack>
          <AddPaymentDrawer />
        </HStack>
      </HStack>
      <PaymentsTable />
    </Card>
  );
}
