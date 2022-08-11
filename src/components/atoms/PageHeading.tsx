import { Box, Heading, HeadingProps } from '@chakra-ui/react';
import { ReactNode, useContext } from 'react';

import { ColorContext } from '@/contexts';
import { CustomDivider } from './CustomDivider';

interface PageHeadingProps extends HeadingProps {
  children: ReactNode;
  divided?: boolean;
}

export function PageHeading({
  children,
  divided = true,
  ...rest
}: PageHeadingProps) {
  const { invertedBg } = useContext(ColorContext);
  return (
    <Box mb={4}>
      <Heading
        as="h1"
        textAlign="center"
        size="xl"
        fontWeight="extrabold"
        textColor={invertedBg}
        textTransform="uppercase"
        {...rest}
      >
        {children}
      </Heading>
      {divided && <CustomDivider />}
    </Box>
  );
}
