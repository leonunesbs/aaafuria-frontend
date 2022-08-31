import {
  CustomButton,
  CustomIconButton,
  PageHeading,
  PostCard,
} from '@/components/atoms';

import { Card, Layout } from '@/components/templates';
import { gql, useMutation, useQuery } from '@apollo/client';
import '@uiw/react-markdown-preview/markdown.css';
import '@uiw/react-md-editor/markdown-editor.css';
import { useCallback, useContext } from 'react';

import { AuthContext, ColorContext } from '@/contexts';
import { Post } from '@/types/Post';
import {
  Box,
  HStack,
  Skeleton,
  Spinner,
  Stack,
  Tag,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { MDEditorProps } from '@uiw/react-md-editor';
import { relativeTime } from 'libs/utils';
import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { parseCookies } from 'nookies';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { BsChevronCompactDown, BsChevronCompactUp } from 'react-icons/bs';
import { MdDelete } from 'react-icons/md';

const Markdown = dynamic<any>(
  () => import('@uiw/react-markdown-preview').then((mod) => mod.default),
  { ssr: false },
);

const MDEditor = dynamic<MDEditorProps>(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false },
);

export const GET_POST = gql`
  query getPost($id: ID!) {
    post(id: $id) {
      id
      title
      content
      ratio
      author {
        id
        member {
          id
          nickname
        }
      }
      created
      updated
      childrens(id: $id, page: 1, pageSize: 30) {
        objects {
          id
          title
          content
          ratio
          author {
            id
            member {
              id
              nickname
            }
          }
          created
          updated
        }
      }
    }
  }
`;

const CREATE_POST = gql`
  mutation createPost($parentId: ID, $content: String!) {
    createPost(parentId: $parentId, content: $content) {
      ok
    }
  }
`;
const RATE_POST = gql`
  mutation ratePost($postId: ID!, $liked: Boolean!) {
    ratePost(postId: $postId, liked: $liked) {
      ok
    }
  }
`;
const DELETE_POST = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId) {
      ok
    }
  }
`;

type Inputs = {
  content: string;
};

interface GetPostData {
  post: Post;
}

function Post() {
  const router = useRouter();
  const toast = useToast();
  const { user, authCredentials } = useContext(AuthContext);
  const { green } = useContext(ColorContext);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { id } = router.query;

  const { handleSubmit, reset, control } = useForm<Inputs>();
  const { data, refetch } = useQuery<GetPostData>(GET_POST, {
    variables: {
      id,
    },
    ...authCredentials(),
  });

  const post = data?.post;
  const childrens = post?.childrens.objects;

  const [createPost, { loading }] = useMutation(CREATE_POST, authCredentials());
  const [ratePost, { loading: rating }] = useMutation(
    RATE_POST,
    authCredentials(),
  );
  const [deletePost, { loading: deleting }] = useMutation(
    DELETE_POST,
    authCredentials(),
  );

  const handleReply: SubmitHandler<Inputs> = useCallback(
    async ({ content }) => {
      await createPost({
        variables: {
          parentId: post?.id,
          content,
        },
      }).then(async ({ data }) => {
        if (data.createPost.ok) {
          refetch();
          reset();
          onClose();
        }
      });
    },
    [createPost, onClose, post?.id, refetch, reset],
  );

  const handleRate = useCallback(
    async (liked: boolean) => {
      await ratePost({
        variables: {
          postId: post?.id,
          liked,
        },
      })
        .then(() => {
          toast({
            description: 'Avaliado com sucesso.',
            status: 'info',
            duration: 2500,
            isClosable: true,
            position: 'top-left',
          });
          refetch();
        })
        .catch((error) => {
          toast({
            description: error.message,
            status: 'info',
            duration: 2500,
            isClosable: true,
            position: 'top-left',
          });
        });
    },
    [post, ratePost, refetch, toast],
  );

  const handleDelete = useCallback(async () => {
    await deletePost({
      variables: {
        postId: post?.id,
      },
    }).then(async ({ data }) => {
      if (data.deletePost.ok) {
        refetch();
        router.push('/feed');
      }
    });
  }, [deletePost, post, refetch, router]);

  return (
    <Layout title={post?.title as string}>
      <HStack align={'flex-start'}>
        <Stack align={'center'} spacing={1}>
          <CustomIconButton
            aria-label={''}
            icon={<BsChevronCompactUp size="15px" />}
            size="xs"
            onClick={() => handleRate(true)}
          />
          {rating ? (
            <Spinner size={'xs'} color={green} />
          ) : (
            <Text fontSize={'xs'}>{post?.ratio}</Text>
          )}
          <CustomIconButton
            aria-label={''}
            icon={<BsChevronCompactDown size="15px" />}
            size="xs"
            onClick={() => handleRate(false)}
          />
        </Stack>
        <Box w="full">
          {post ? (
            <PageHeading textAlign={'left'}>{post?.title}</PageHeading>
          ) : (
            <Skeleton isLoaded={!!post} maxW="sm" h={6} mb={4} />
          )}
          <Skeleton isLoaded={!!post}>
            <HStack fontSize={'xs'} mb={2}>
              <Tag colorScheme={'green'} rounded="full" size="sm">
                {post?.author.member.nickname}
              </Tag>
              <Text fontWeight={'light'}>
                {relativeTime(new Date(post?.created as string)) ||
                  new Date(post?.created as string).toLocaleString('pt-BR', {
                    timeStyle: 'short',
                    dateStyle: 'short',
                    timeZone: 'America/Sao_Paulo',
                  })}
              </Text>
              {user?.id === post?.author.id && (
                <CustomIconButton
                  size="xs"
                  colorScheme="red"
                  icon={<MdDelete size="15px" />}
                  aria-label={'Excluir'}
                  onClick={handleDelete}
                  isLoading={deleting}
                />
              )}
            </HStack>
          </Skeleton>

          <Skeleton isLoaded={!!post}>
            <Box mb={4}>
              <Markdown source={post?.content} />
            </Box>
          </Skeleton>
        </Box>
      </HStack>
      {isOpen ? (
        <form onSubmit={handleSubmit(handleReply)}>
          <Stack>
            <div data-color-mode="light">
              <Controller
                name="content"
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field }) => (
                  <MDEditor color="#9aca3c" height={400} {...field} />
                )}
              />
            </div>
            <HStack alignSelf="flex-end" maxW="3xs">
              <CustomButton
                size="sm"
                maxW="3xs"
                colorScheme="gray"
                variant="ghost"
                onClick={onClose}
              >
                Cancelar
              </CustomButton>
              <CustomButton
                size="sm"
                maxW="3xs"
                variant="solid"
                type="submit"
                isLoading={loading}
              >
                Publicar
              </CustomButton>
            </HStack>
          </Stack>
        </form>
      ) : (
        <Card>
          <CustomButton
            size="sm"
            maxW="3xs"
            variant="solid"
            colorScheme="gray"
            onClick={onOpen}
          >
            Responder
          </CustomButton>
        </Card>
      )}
      <Stack>
        {childrens?.map((children, i: number) => (
          <PostCard key={i} post={children} refetchParent={refetch} />
        ))}
      </Stack>
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

export default Post;
