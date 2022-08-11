import { Button, ButtonProps } from '@chakra-ui/react';
import { ReactNode, forwardRef, useContext } from 'react';

import { ColorContext } from '@/contexts';

interface CustomButtonProps extends ButtonProps {
  children: ReactNode;
}

export const CustomButton = forwardRef<HTMLButtonElement, CustomButtonProps>(
  ({ children, ...rest }, ref) => {
    const { green } = useContext(ColorContext);
    return (
      <Button
        ref={ref}
        colorScheme="green"
        variant="outline"
        w="full"
        rounded="full"
        _focus={{
          outlineColor: green,
          outlineWidth: 'thin',
        }}
        {...rest}
      >
        {children}
      </Button>
    );
  },
);

CustomButton.displayName = 'CustomButton';
