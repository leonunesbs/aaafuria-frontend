import { IconButton, IconButtonProps } from '@chakra-ui/react';
import { ReactNode, forwardRef, useContext } from 'react';

import { ColorContext } from '@/contexts';

export interface CustomIconButtonProps extends IconButtonProps {
  children?: ReactNode;
}

export const CustomIconButton = forwardRef<
  HTMLButtonElement,
  CustomIconButtonProps
>(({ children, 'aria-label': ariaLabel, ...rest }, ref) => {
  const { green } = useContext(ColorContext);

  return (
    <IconButton
      ref={ref}
      aria-label={ariaLabel}
      colorScheme="green"
      variant="ghost"
      _focus={{
        outlineColor: green,
        outlineWidth: '0.5px',
      }}
      {...rest}
    >
      {children}
    </IconButton>
  );
});

CustomIconButton.displayName = 'CustomIconButton';
