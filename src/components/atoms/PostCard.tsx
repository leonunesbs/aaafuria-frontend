import { AuthContext, ColorContext } from '@/contexts';
import { GET_POST } from '@/pages/feed/post/[id]';
import { Post } from '@/types/Post';
import { gql, useMutation, useQuery } from '@apollo/client';
import {
  Box,
  HStack,
  Spinner,
  Stack,
  Tag,
  Text,
  Textarea,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { relativeTime } from 'libs/utils';
import { Fragment, useCallback, useContext } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { BsChevronCompactDown, BsChevronCompactUp } from 'react-icons/bs';
import { MdDelete } from 'react-icons/md';
import { CustomButton } from './CustomButton';
import { CustomIconButton } from './CustomIconButton';

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

export interface PostCardProps {
  post: Post;
  refetchParent: () => void;
}

export function PostCard({ post, refetchParent }: PostCardProps) {
  const postId = post.id;
  const { green } = useContext(ColorContext);
  const { user, token } = useContext(AuthContext);

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { handleSubmit, register, reset } = useForm<Inputs>();

  const { data, refetch } = useQuery<GetPostData>(GET_POST, {
    variables: {
      id: postId,
    },
  });
  const [createPost, { loading }] = useMutation(CREATE_POST, {
    context: {
      headers: {
        Authorization: `JWT ${token}`,
      },
    },
  });
  const [ratePost, { loading: rating }] = useMutation(RATE_POST, {
    context: {
      headers: {
        Authorization: `JWT ${token}`,
      },
    },
  });
  const [deletePost, { loading: deleting }] = useMutation(DELETE_POST, {
    context: {
      headers: {
        Authorization: `JWT ${token}`,
      },
    },
  });
  const childrens = data?.post?.childrens.objects;

  const handleReply: SubmitHandler<Inputs> = useCallback(
    async ({ content }) => {
      await createPost({
        variables: {
          parentId: postId,
          content,
        },
      }).then(async ({ data }) => {
        if (data.createPost.ok) {
          reset();
          refetch();
          onClose();
        }
      });
    },
    [createPost, onClose, postId, refetch, reset],
  );

  const handleDelete = useCallback(async () => {
    await deletePost({
      variables: {
        postId,
      },
    }).then(async ({ data }) => {
      if (data.deletePost.ok) {
        refetch();
        refetchParent();
      }
    });
  }, [deletePost, postId, refetch, refetchParent]);

  const handleRate = useCallback(
    async (liked: boolean) => {
      await ratePost({
        variables: {
          postId,
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
    [postId, ratePost, refetch, toast],
  );

  if (!post) {
    return <Box />;
  }

  return (
    <HStack align={'flex-start'} my={4}>
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
        <HStack fontSize={'xs'} mb={2} justify="flex-start">
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
          {(user?.id === post?.author.id || user?.isStaff) && (
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
        <Text mb={4}>{post?.content}</Text>
        {isOpen ? (
          <form onSubmit={handleSubmit(handleReply)}>
            <Stack>
              <Textarea
                rounded={'xl'}
                focusBorderColor={green}
                _dark={{ focusBorderColor: green }}
                {...register('content')}
              />
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
          <CustomButton
            size="sm"
            maxW="3xs"
            variant="solid"
            colorScheme="gray"
            onClick={onOpen}
          >
            Responder
          </CustomButton>
        )}
        <Stack>
          {childrens?.map((children, i: number) => (
            <Fragment key={i}>
              <PostCard post={children} refetchParent={refetch} />
            </Fragment>
          ))}
        </Stack>
      </Box>
    </HStack>
  );
}
