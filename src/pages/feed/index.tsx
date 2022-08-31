import {
  CustomIconButton,
  PageHeading,
  PostListItem,
} from '@/components/atoms';
import { Card, Layout } from '@/components/templates';
import { gql, useQuery } from '@apollo/client';
import { Box, HStack, List, Text, useColorModeValue } from '@chakra-ui/react';

import { AuthContext } from '@/contexts';
import { Post } from '@/types/Post';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { parseCookies } from 'nookies';
import { useContext } from 'react';
import { MdAdd } from 'react-icons/md';

const GET_POSTS = gql`
  query getPosts {
    mainPosts(page: 1, pageSize: 30) {
      objects {
        id
        title
        content
        created
        ratio
        replies
        author {
          member {
            nickname
          }
        }
        viewers {
          edges {
            node {
              id
            }
          }
        }
      }
    }
  }
`;

type GetPostsData = {
  mainPosts: {
    objects: Post[];
  };
};

function Blog() {
  const router = useRouter();
  const { user, authCredentials } = useContext(AuthContext);
  const { data } = useQuery<GetPostsData>(GET_POSTS, authCredentials());
  const posts = data?.mainPosts?.objects;
  const calango = useColorModeValue(
    '/calango-verde.png',
    '/calango-verde-b.png',
  );
  return (
    <Layout title="Feed">
      <Box maxW="8xl" mx="auto">
        <PageHeading>Feed</PageHeading>
        <HStack justify="flex-end" mb={4} spacing={4}>
          <HStack>
            <Card px={4} py={2}>
              <HStack align={'center'} justify="center" spacing={1}>
                <Image
                  alt="Fcoins"
                  src={calango}
                  width={'15px'}
                  height={'15px'}
                />
                <Text>{user?.member.blogCoins}</Text>
              </HStack>
            </Card>
          </HStack>
          <CustomIconButton
            variant={'solid'}
            size="sm"
            icon={<MdAdd size="25px" />}
            onClick={() => router.push('/feed/publish')}
            aria-label={'Publicar conteúdo'}
          />
        </HStack>
        <List spacing={2}>
          {posts?.map((post: any, i: number) => (
            <PostListItem key={i} post={post} i={i} />
          ))}
        </List>
      </Box>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ['aaafuriaToken']: token } = parseCookies(ctx);

  if (!token) {
    return {
      redirect: {
        destination: `/login?after=${ctx.resolvedUrl}`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      token,
    },
  };
};

export default Blog;
