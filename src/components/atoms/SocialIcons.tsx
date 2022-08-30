import {
  AiFillFacebook,
  AiFillInstagram,
  AiFillTwitterSquare,
} from 'react-icons/ai';
import { HStack, Stack } from '@chakra-ui/react';

import { CustomIconButton } from './CustomIconButton';
import { FaTiktok } from 'react-icons/fa';
import router from 'next/router';

interface SocialIconsProps {
  variant?: string;
  shouldWrap?: boolean;
  iconButtonProps?: any;
}

export function SocialIcons({
  shouldWrap,
  iconButtonProps,
  ...rest
}: SocialIconsProps) {
  return (
    <Stack
      justify="center"
      direction={shouldWrap ? ['column', 'row'] : 'row'}
      {...rest}
    >
      <HStack>
        <CustomIconButton
          aria-label="Facebook"
          icon={<AiFillFacebook size="35px" />}
          onClick={() => router.push('https://facebook.com/aaafuria')}
          {...iconButtonProps}
        />
        <CustomIconButton
          aria-label="Instagram"
          icon={<AiFillInstagram size="35px" />}
          onClick={() => router.push('https://instagram.com/aaafuria')}
          {...iconButtonProps}
        />
      </HStack>
      <HStack>
        <CustomIconButton
          aria-label="Twitter"
          icon={<AiFillTwitterSquare size="35px" />}
          onClick={() => router.push('https://twitter.com/Aaafuria')}
          {...iconButtonProps}
        />
        <CustomIconButton
          aria-label="TikTok"
          icon={<FaTiktok size="35px" />}
          onClick={() => router.push('https://tiktok.com/@aaafuria')}
          {...iconButtonProps}
        />
      </HStack>
    </Stack>
  );
}
