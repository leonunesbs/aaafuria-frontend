import {
  AiFillFacebook,
  AiFillInstagram,
  AiFillTwitterSquare,
} from 'react-icons/ai';
import { HStack, Stack, StackProps } from '@chakra-ui/react';

import { CustomIconButton } from './CustomIconButton';
import { FaTiktok } from 'react-icons/fa';
import router from 'next/router';

interface SocialIconsProps extends StackProps {
  variant?: string;
  shouldWrap?: boolean;
}

export function SocialIcons({
  shouldWrap,
  variant,
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
          variant={variant}
          icon={<AiFillFacebook size="35px" />}
          onClick={() => router.push('https://facebook.com/aaafuria')}
        />
        <CustomIconButton
          aria-label="Instagram"
          variant={variant}
          icon={<AiFillInstagram size="35px" />}
          onClick={() => router.push('https://instagram.com/aaafuria')}
        />
      </HStack>
      <HStack>
        <CustomIconButton
          aria-label="Twitter"
          variant={variant}
          icon={<AiFillTwitterSquare size="35px" />}
          onClick={() => router.push('https://twitter.com/Aaafuria')}
        />
        <CustomIconButton
          aria-label="TikTok"
          variant={variant}
          icon={<FaTiktok size="35px" />}
          onClick={() => router.push('https://tiktok.com/@aaafuria')}
        />
      </HStack>
    </Stack>
  );
}
