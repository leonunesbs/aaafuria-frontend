import { CustomButton, PageHeading, PostListItem } from '@/components/atoms';
import { Layout } from '@/components/templates';
import { Post } from '@/types/Post';
import { gql, useQuery } from '@apollo/client';
import { Box, HStack, List } from '@chakra-ui/react';

import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { parseCookies } from 'nookies';
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
  const { data } = useQuery<GetPostsData>(GET_POSTS);
  const posts = data?.mainPosts?.objects;
  return (
    <Layout title="Feed">
      <Box maxW="8xl" mx="auto">
        <PageHeading>Feed</PageHeading>
        <HStack justify="flex-end" mb={4}>
          <CustomButton
            variant={'solid'}
            maxW="3xs"
            size="sm"
            leftIcon={<MdAdd size="25px" />}
            onClick={() => router.push('/feed/publish')}
          >
            Publicar conteúdo
          </CustomButton>
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
