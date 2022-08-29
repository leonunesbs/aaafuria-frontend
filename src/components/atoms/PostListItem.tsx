import { ColorContext } from '@/contexts';
import { Post } from '@/types/Post';
import { Box, HStack, ListItem, Stack, Text } from '@chakra-ui/react';
import { relativeTime } from 'libs/utils';
import { useContext } from 'react';
import { Card } from '../templates';
import { CustomLink } from './CustomLink';

interface PostListItemProps {
  post: Post;
  i: number;
}

export function PostListItem({ post, i }: PostListItemProps) {
  const { green } = useContext(ColorContext);
  return (
    <ListItem key={post.id}>
      <Card py={4}>
        <HStack align={'flex-start'}>
          <Box>
            <Text>{i + 1}.</Text>
          </Box>
          <Stack spacing={1}>
            <CustomLink
              href={`/feed/post/${post.id}`}
              chakraLinkProps={{
                _hover: {
                  color: 'green.500',
                  _dark: {
                    color: 'green.200',
                  },
                },
                fontWeight: 'bold',
              }}
            >
              {post.title}
            </CustomLink>

            <Text
              textColor="blackAlpha.500"
              _dark={{
                textColor: 'whiteAlpha.500',
              }}
              fontSize={'xs'}
            >
              {post?.ratio}{' '}
              <Text as="span" textColor={green}>
                F
              </Text>
              coins -{' '}
              {post?.replies > 1 ? (
                <>{post.replies} comentários</>
              ) : (
                <>{post.replies} comentário</>
              )}{' '}
              - {post.author.member.nickname} -{' '}
              {relativeTime(new Date(post?.created as string)) ||
                new Date(post?.created as string).toLocaleString('pt-BR', {
                  timeStyle: 'short',
                  dateStyle: 'short',
                  timeZone: 'America/Sao_Paulo',
                })}
            </Text>
          </Stack>
        </HStack>
      </Card>
    </ListItem>
  );
}
