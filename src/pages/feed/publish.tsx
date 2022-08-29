import { CustomButton, PageHeading } from '@/components/atoms';
import { Card, Layout } from '@/components/templates';
import { AuthContext, ColorContext } from '@/contexts';
import { gql, useMutation } from '@apollo/client';
import { Box, HStack, Input, Stack, Textarea } from '@chakra-ui/react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { parseCookies } from 'nookies';
import { useCallback, useContext } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

const CREATE_POST = gql`
  mutation createPost($title: String, $content: String!) {
    createPost(title: $title, content: $content) {
      ok
      post {
        id
      }
    }
  }
`;

type Inputs = {
  title: string;
  content: string;
};

function Publish() {
  const router = useRouter();
  const { token } = useContext(AuthContext);
  const { green } = useContext(ColorContext);
  const [createPost, { loading }] = useMutation(CREATE_POST, {
    context: {
      headers: {
        Authorization: `JWT ${token}`,
      },
    },
  });

  const { handleSubmit, register } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = useCallback(
    async ({ title, content }) => {
      await createPost({
        variables: {
          title,
          content,
        },
      }).then(({ data }) => {
        if (data.createPost.ok) {
          router.push(`/feed/post/${data.createPost.post.id}`);
        }
      });
    },
    [createPost, router],
  );

  return (
    <Layout title="Publicar novo conteúdo">
      <Box maxW="8xl">
        <PageHeading>Publicar novo conteúdo</PageHeading>

        <Card>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack>
              <Input
                rounded="xl"
                placeholder="Título"
                focusBorderColor={green}
                isRequired
                {...register('title')}
              />
              <Textarea
                rounded="xl"
                minH={'xs'}
                focusBorderColor={green}
                isRequired
                {...register('content')}
              />
              <HStack justify={'flex-end'}>
                <CustomButton
                  size="sm"
                  maxW="3xs"
                  colorScheme="gray"
                  variant="ghost"
                  onClick={() => router.push('/feed')}
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
        </Card>
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

export default Publish;
