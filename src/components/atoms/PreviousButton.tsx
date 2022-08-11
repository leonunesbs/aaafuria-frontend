import { Box } from '@chakra-ui/react';
import { CustomButton } from './CustomButton';
import { CustomLink } from './CustomLink';
import { MdArrowLeft } from 'react-icons/md';

interface PreviousButtonProps {
  href: string;
}

export function PreviousButton({ href, ...rest }: PreviousButtonProps) {
  return (
    <Box mt={4}>
      <CustomLink href={href} {...rest}>
        <CustomButton colorScheme="red" leftIcon={<MdArrowLeft size="25px" />}>
          Voltar
        </CustomButton>
      </CustomLink>
    </Box>
  );
}
