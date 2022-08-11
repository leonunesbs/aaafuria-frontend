import { Box, BoxProps, useColorModeValue } from '@chakra-ui/react';
import { ReactNode, forwardRef } from 'react';

interface CardProps extends BoxProps {
  children: ReactNode;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, ...rest }, ref) => {
    const bg = useColorModeValue('white', 'whiteAlpha.50');
    const shadow = useColorModeValue('base', 'none');

    return (
      <Box
        ref={ref}
        bg={bg}
        py="8"
        px={{ base: '4', md: '10' }}
        shadow={shadow}
        rounded="3xl"
        {...rest}
      >
        {children}
      </Box>
    );
  },
);

Card.displayName = 'Card';
