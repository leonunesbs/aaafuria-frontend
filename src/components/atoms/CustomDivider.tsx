import { Flex, FlexProps } from '@chakra-ui/react';
import { ReactNode, useContext } from 'react';

import { ColorContext } from '@/contexts';

interface CustomDividerProps extends FlexProps {
  children?: ReactNode;
}

export function CustomDivider({ ...rest }: CustomDividerProps) {
  const { green } = useContext(ColorContext);
  return (
    <Flex
      as="hr"
      flexGrow={1}
      bgColor={green}
      h={'1px'}
      rounded="full"
      {...rest}
    />
  );
}
