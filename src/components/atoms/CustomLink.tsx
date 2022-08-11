import { Link, LinkProps } from '@chakra-ui/react';
import NextLink, { LinkProps as NextLinkProps } from 'next/link';
import { ReactNode, useContext } from 'react';

import { ColorContext } from '@/contexts';

interface CustomLinkProps extends NextLinkProps {
  children: ReactNode;
  chakraLinkProps?: LinkProps;
}

export function CustomLink({
  children,
  href,
  chakraLinkProps,
  ...rest
}: CustomLinkProps) {
  const { green } = useContext(ColorContext);
  return (
    <NextLink scroll={false} href={href} passHref {...rest}>
      <Link
        href={href as string}
        borderRadius={'md'}
        _hover={{ textDecoration: 'none' }}
        _focus={{
          outlineColor: green,
          outlineWidth: 'thin',
        }}
        {...chakraLinkProps}
      >
        {children}
      </Link>
    </NextLink>
  );
}
