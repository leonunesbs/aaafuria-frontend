import { AuthContext, ColorContext } from '@/contexts';
import {
  Avatar,
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { CustomButton, CustomIconButton, HeaderImage } from '../atoms';
import { FaDrum, FaVolleyballBall } from 'react-icons/fa';
import {
  MdDynamicFeed,
  MdLogin,
  MdLogout,
  MdManageAccounts,
  MdPerson,
  MdStore,
} from 'react-icons/md';
import { ReactNode, useContext } from 'react';

import { AiFillHome } from 'react-icons/ai';
import { CgMenu } from 'react-icons/cg';
import { ImCross } from 'react-icons/im';
import { useRouter } from 'next/router';

interface SideMenuProps {
  children?: ReactNode;
}

export function SideMenu({}: SideMenuProps) {
  const router = useRouter();
  const { onToggle, isOpen, onClose } = useDisclosure();
  const { user, isAuthenticated, signOut } = useContext(AuthContext);
  const { green, bg } = useContext(ColorContext);
  return (
    <>
      <CustomIconButton
        aria-label="hamburguer-menu"
        onClick={onToggle}
        icon={<CgMenu size="25px" />}
      />
      <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="xs">
        <DrawerOverlay />
        <DrawerContent bgColor={green} pr={6}>
          <DrawerCloseButton mr={6} />
          <DrawerHeader borderBottomRadius={'md'}>
            <HeaderImage />
          </DrawerHeader>

          <DrawerBody borderRightRadius={'md'} my={2} py={4} px={2}>
            <Stack>
              <CustomButton
                isActive={router.asPath == '/'}
                variant={'solid'}
                justifyContent={'flex-start'}
                leftIcon={<AiFillHome size="20px" />}
                onClick={() => router.push('/')}
              >
                Início
              </CustomButton>
              <CustomButton
                isActive={router.asPath == '/feed'}
                variant={'solid'}
                justifyContent={'flex-start'}
                leftIcon={<MdDynamicFeed size="20px" />}
                onClick={() => router.push('/feed')}
              >
                Feed
              </CustomButton>
              <CustomButton
                isActive={router.asPath == '/store'}
                variant={'solid'}
                justifyContent={'flex-start'}
                leftIcon={<MdStore size="20px" />}
                onClick={() => router.push('/store')}
              >
                Loja
              </CustomButton>

              <CustomButton
                isActive={router.asPath == '/activities'}
                variant={'solid'}
                justifyContent={'flex-start'}
                leftIcon={
                  <HStack>
                    <FaVolleyballBall size="20px" />
                    <FaDrum size="20px" />
                  </HStack>
                }
                onClick={() => router.push('/activities')}
              >
                Atividades
              </CustomButton>
              <CustomButton
                isActive={router.asPath == '/activities/matches'}
                variant={'solid'}
                justifyContent={'flex-start'}
                leftIcon={<ImCross size="20px" />}
                onClick={() => router.push('/activities/matches')}
              >
                Confrontos
              </CustomButton>
            </Stack>
          </DrawerBody>

          <DrawerFooter borderTopRadius={'md'}>
            {isAuthenticated ? (
              <Box w="full">
                <Stack>
                  <CustomButton
                    isActive={router.asPath == '/member/dashboard'}
                    variant={'solid'}
                    justifyContent={'flex-start'}
                    leftIcon={<MdPerson size="20px" />}
                    onClick={() => router.push('/member/dashboard')}
                  >
                    Área do Membro
                  </CustomButton>
                  {user?.isStaff && (
                    <CustomButton
                      isActive={router.asPath == '/admin/dashboard'}
                      variant={'solid'}
                      colorScheme="yellow"
                      justifyContent={'flex-start'}
                      leftIcon={<MdManageAccounts size="20px" />}
                      onClick={() => router.push('/admin/dashboard')}
                    >
                      Área do Diretor
                    </CustomButton>
                  )}
                </Stack>
                <Box h={'1px'} my={6} bgColor={'rgb(0,0,0,0.5)'} rounded="sm" />
                <Stack>
                  <HStack w="full" justify={'space-between'}>
                    <HStack>
                      <Avatar
                        name={user?.member.name}
                        src={user?.member.avatar}
                        border={
                          user?.member.hasActiveMembership
                            ? '2px solid green'
                            : '2px solid gray'
                        }
                        onClick={() => router.push('/member/my-identity')}
                      />
                      <Stack spacing={0} textColor={bg}>
                        <Text fontSize={['md']} fontWeight="bold">
                          {user?.member.nickname}
                        </Text>
                        <Text fontSize={['xs']}>
                          {user?.member.registration}
                        </Text>
                      </Stack>
                    </HStack>
                    <CustomIconButton
                      aria-label="sair"
                      variant={'solid'}
                      icon={<MdLogout size="20px" />}
                      onClick={signOut}
                    />
                  </HStack>
                </Stack>
              </Box>
            ) : (
              <Box w="full">
                <CustomButton
                  isActive={router.asPath == '/login'}
                  variant={'solid'}
                  justifyContent={'flex-start'}
                  leftIcon={<MdLogin size="20px" />}
                  onClick={() => router.push('/login')}
                >
                  Entrar
                </CustomButton>
              </Box>
            )}
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
