import { BsFillMoonFill, BsFillSunFill } from 'react-icons/bs';
import { useColorMode, useColorModeValue } from '@chakra-ui/react';

import { CustomIconButton } from './CustomIconButton';
import { ReactNode } from 'react';

interface ColorModeToggleProps {
  children?: ReactNode;
}

export function ColorModeToggle({}: ColorModeToggleProps) {
  const { toggleColorMode } = useColorMode();
  const icon = useColorModeValue(
    <BsFillMoonFill size="20px" />,
    <BsFillSunFill size="20px" />,
  );
  return (
    <CustomIconButton
      aria-label="colorMode"
      icon={icon}
      onClick={toggleColorMode}
    />
  );
}
