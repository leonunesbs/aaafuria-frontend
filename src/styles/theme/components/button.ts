import { ComponentStyleConfig } from '@chakra-ui/react';

const Button: ComponentStyleConfig = {
  variants: {
    solid: {
      _hover: {
        bgColor: 'rgb(17,121,21)',
        bg: 'linear-gradient(140deg, rgba(17,121,21,1) 48%, rgba(154,202,60,1) 100%)',
        textColor: 'white',
      },
      _active: {
        textColor: 'white',
      },
      _dark: {
        _hover: {
          bgColor: 'rgba(154,202,60,1)',
          bg: 'linear-gradient(140deg, rgba(154,202,60,1) 48%, rgba(17,121,21,1) 100%)',
          textColor: 'white',
        },
      },
    },
  },
};
export default Button;
