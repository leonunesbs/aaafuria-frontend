import { useColorMode, useColorModeValue } from '@chakra-ui/react';
import { ReactNode, useEffect } from 'react';
import { BsFillMoonFill, BsFillSunFill } from 'react-icons/bs';

import { CustomIconButton } from './CustomIconButton';

interface ColorModeToggleProps {
  children?: ReactNode;
}

export function ColorModeToggle({}: ColorModeToggleProps) {
  const { toggleColorMode, colorMode } = useColorMode();
  const icon = useColorModeValue(
    <BsFillMoonFill size="20px" />,
    <BsFillSunFill size="20px" />,
  );

  useEffect(() => {
    if (document) {
      document.documentElement.setAttribute('data-color-mode', colorMode);
    }
  }, [colorMode]);
  return (
    <CustomIconButton
      aria-label="colorMode"
      icon={icon}
      onClick={toggleColorMode}
    />
  );
}
