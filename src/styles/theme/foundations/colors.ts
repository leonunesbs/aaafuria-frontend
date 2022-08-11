import { ThemeOverride } from '@chakra-ui/react';

const override: ThemeOverride = {
  colors: {
    gray: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#eeeeee',
      300: '#e0e0e0',
      400: '#bdbdbd',
      500: '#9e9e9e',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
      999: '#121212',
    },
    green: {
      200: '#9aca3c',
      300: '#9aca3c',
      400: '#14783C',
      500: '#14783C',
      600: '#14783C',
    },
    darkModeWhite: {
      500: 'rgba(255, 255, 255, 0.5)',
      600: 'rgba(255, 255, 255, 0.6)',
      700: 'rgba(255, 255, 255, 0.7)',
      800: 'rgba(255, 255, 255, 0.8)',
      900: 'rgba(255, 255, 255, 0.9)',
    },
  },
};

export default override.colors;
