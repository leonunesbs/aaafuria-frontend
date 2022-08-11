import { AuthContext, ColorContext } from '@/contexts';
import { Avatar, Box, Center, Flex, HStack } from '@chakra-ui/react';
import {
  ColorModeToggle,
  CustomButton,
  CustomIconButton,
  CustomLink,
  HeaderImage,
} from '../atoms';
import { ReactNode, useContext, useMemo } from 'react';

import { MdShoppingCart } from 'react-icons/md';
import { SideMenu } from '.';
import { useRouter } from 'next/router';

const HeaderMenuItem = ({
  children,
  href,
}: {
  children: ReactNode;
  href: string;
}) => {
  const router = useRouter();
  const { green, invertedBg } = useContext(ColorContext);

  return (
    <CustomLink
      chakraLinkProps={{
        textColor: router.asPath === href ? green : invertedBg,
      }}
      href={href}
    >
      {children}
    </CustomLink>
  );
};

interface HeaderProps {
  children?: ReactNode;
}

export function Header({}: HeaderProps) {
  const router = useRouter();
  const { user, isAuthenticated } = useContext(AuthContext);

  const menuItems = useMemo(
    () => [
      {
        title: 'Início',
        href: '/',
      },
      {
        title: 'Loja',
        href: '/store',
      },
      {
        title: 'Atividades',
        href: '/activities',
      },
      {
        title: 'Confrontos',
        href: '/activities/matches',
      },
    ],
    [],
  );
  return (
    <Box maxW="8xl" mx="auto">
      <Flex justify="space-between" py="2" mx="auto" px={['2', '10']}>
        <HStack spacing={10}>
          <Center>
            <HeaderImage />
          </Center>
          <HStack
            display={['none', 'none', 'none', 'flex']}
            spacing={6}
            fontSize={'lg'}
            fontFamily="AACHENN"
            textTransform={'uppercase'}
          >
            {menuItems.map((item) => (
              <HeaderMenuItem key={item.href} href={item.href}>
                {item.title}
              </HeaderMenuItem>
            ))}
          </HStack>
        </HStack>
        <HStack spacing={[2, 2, 4]}>
          <ColorModeToggle />
          {isAuthenticated ? (
            <>
              {router.asPath.includes('/store') && (
                <CustomIconButton
                  aria-label="cart"
                  icon={<MdShoppingCart size="25px" />}
                  onClick={() => router.push('/store/cart')}
                />
              )}
              <Avatar
                display={['none', 'none', 'flex']}
                name={user?.member.name}
                src={user?.member.avatar}
                border={
                  user?.member.hasActiveMembership
                    ? '2px solid green'
                    : '2px solid gray'
                }
                onClick={() => router.push('/member/my-identity')}
              />
            </>
          ) : (
            <CustomButton
              display={['none', 'none', 'flex']}
              onClick={() => router.push('/login')}
            >
              Entrar
            </CustomButton>
          )}
          <SideMenu />
        </HStack>
      </Flex>
    </Box>
  );
}
