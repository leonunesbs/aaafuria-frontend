import { createContext } from 'react';
import { useColorModeValue } from '@chakra-ui/react';

interface ColorContextProps {
  green: string;
  bg: string;
  invertedBg: string;
}

interface ColorProviderProps {
  children: React.ReactNode;
}

export const ColorContext = createContext({} as ColorContextProps);

export function ColorProvider({ children }: ColorProviderProps) {
  const green = useColorModeValue('green.500', 'green.200');
  const bg = useColorModeValue('white', 'gray.800');
  const invertedBg = useColorModeValue('gray.800', 'white');

  return (
    <ColorContext.Provider
      value={{
        green,
        bg,
        invertedBg,
      }}
    >
      {children}
    </ColorContext.Provider>
  );
}
