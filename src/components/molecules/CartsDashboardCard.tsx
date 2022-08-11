import { Box, HStack, Heading } from '@chakra-ui/react';
import { ReactNode, useContext } from 'react';

import { Card } from '../templates';
import { CartsTable } from '../atoms';
import { ColorContext } from '@/contexts/ColorContext';

interface CartsDashboardCardProps {
  children?: ReactNode;
}

export function CartsDashboardCard({}: CartsDashboardCardProps) {
  const { green } = useContext(ColorContext);
  return (
    <Card>
      <HStack mb={4} w="full" justify={'space-between'}>
        <Box>
          <Heading size="md" color={green}>
            PEDIDOS
          </Heading>
        </Box>
      </HStack>
      <CartsTable />
    </Card>
  );
}
