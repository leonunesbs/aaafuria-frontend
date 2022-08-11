import { ThemeOverride } from '@chakra-ui/react';

const override: ThemeOverride = {
  styles: {
    global: ({ colorMode }) => ({
      html: {
        height: '100%',
        scrollBehavior: 'smooth',
      },
      body: {
        height: '100%',
        backgroundColor: colorMode === 'light' ? 'gray.50' : 'gray.999',
        textColor: colorMode === 'light' ? 'gray.900' : 'white',
      },
      a: {
        _hover: {
          textDecoration: 'underline',
        },
      },
    }),
  },
};

export default override.styles;
