import {
  Box,
  BoxProps,
  Circle,
  Grid,
  GridItem,
  HStack,
  Heading,
  Stack,
  Text,
  Textarea,
  chakra,
  useColorModeValue,
} from '@chakra-ui/react';
import { Card, Layout } from '@/components/templates';
import {
  CustomButton,
  CustomDivider,
  CustomIconButton,
  CustomLink,
  PageHeading,
  SocialIcons,
} from '@/components/atoms';
import { FaDrum, FaVolleyballBall } from 'react-icons/fa';
import { forwardRef, useContext, useRef } from 'react';

import { ColorContext } from '@/contexts';
import CountUp from 'react-countup';
import { GiPartyPopper } from 'react-icons/gi';
import { MdStore } from 'react-icons/md';
import NextImage from 'next/image';
import { SejaSocioPricing } from '@/components/molecules';
import client from '@/services/apollo-client';
import { gql } from '@apollo/client';
import { useRouter } from 'next/router';

type FeaturePostData = {
  id: string;
  title: string;
  content: string;
  image: string;
  buttonTarget: string;
};
interface HomeProps {
  post: FeaturePostData;
}

const HomeSection = forwardRef<HTMLDivElement, BoxProps>(
  ({ id, children, ...rest }: BoxProps, ref) => {
    return (
      <Box id={id} ref={ref} py={10} {...rest}>
        {children}
      </Box>
    );
  },
);
HomeSection.displayName = 'HomeSection';

export default function Home({ post }: HomeProps) {
  const router = useRouter();
  const sejaSocioDiv = useRef<HTMLDivElement>(null);
  const postDiv = useRef<HTMLDivElement>(null);
  const featuresDiv = useRef<HTMLDivElement>(null);
  const { bg, green, invertedBg } = useContext(ColorContext);
  const ctaLogo = useColorModeValue('/logo-branco.webp', '/logo-cinza.webp');
  const calango = useColorModeValue(
    '/calango-verde.png',
    '/calango-verde-b.png',
  );
  const ChakraNextImage = chakra(NextImage);
  return (
    <Layout title="Início" py={0} pb={10}>
      <HomeSection id="cta">
        <Grid templateColumns={['1fr', '1fr', '1fr', '2fr 3fr']} gap={4}>
          <GridItem>
            <Stack justify={'center'} h="100%" spacing={6}>
              <Stack>
                <Heading
                  as="h1"
                  fontSize={['4xl', '5xl']}
                  textColor={invertedBg}
                >
                  A
                  <Text as="span" textColor={green}>
                    {' '}
                    MAIOR{' '}
                  </Text>
                  DO PIAUÍ ESTÁ TE ESPERANDO!
                </Heading>
              </Stack>
              <Stack
                direction={['column', 'column', 'row']}
                maxW={['xl', 'xl', 'md']}
              >
                <CustomButton
                  variant={'solid'}
                  onClick={() => router.push('/sejasocio')}
                >
                  Seja Sócio!
                </CustomButton>
                <CustomButton
                  onClick={() =>
                    post
                      ? postDiv.current?.scrollIntoView({
                          block: 'start',
                          behavior: 'smooth',
                        })
                      : featuresDiv.current?.scrollIntoView({
                          block: 'start',
                          behavior: 'smooth',
                        })
                  }
                >
                  Explorar
                </CustomButton>
              </Stack>
              <Box>
                <SocialIcons
                  shouldWrap={false}
                  variant="ghost"
                  justify={['center', 'center', 'flex-start']}
                />
              </Box>
            </Stack>
          </GridItem>
          <GridItem
            display={'flex'}
            justifyContent={['center', 'center', 'center', 'flex-end']}
          >
            <Box boxSize={['xs', 'md', 'xl', '3xl']} position="relative">
              <ChakraNextImage
                placeholder="blur"
                blurDataURL={ctaLogo}
                layout="fill"
                objectFit="cover"
                src={ctaLogo}
                quality={100}
                alt="logo"
                mx="auto"
                mb={{ base: '8', md: '12' }}
                draggable={false}
              />
            </Box>
          </GridItem>
        </Grid>
      </HomeSection>
      <HomeSection id="stats" bgColor={green} textColor={bg} rounded="3xl">
        <Stack
          direction={['column', 'row']}
          justify="space-around"
          mx="auto"
          maxW="8xl"
        >
          <Box textAlign={'center'}>
            <Text fontFamily="AACHENN" fontSize={'5xl'}>
              <CountUp
                start={0}
                end={150}
                suffix="+"
                delay={1}
                duration={1.5}
              />
            </Text>
            <Text>Sócios ativos</Text>
          </Box>
          <Box textAlign={'center'}>
            <Text fontFamily="AACHENN" fontSize={'5xl'}>
              <CountUp start={0} end={10} suffix="+" delay={1.5} duration={1} />
            </Text>
            <Text>Modalidades</Text>
          </Box>
          <Box textAlign={'center'}>
            <Text fontFamily="AACHENN" fontSize={'5xl'}>
              <CountUp
                start={0}
                end={200}
                suffix="+"
                delay={1.2}
                duration={2}
              />
            </Text>
            <Text>Atletas e ritmistas</Text>
          </Box>
        </Stack>
      </HomeSection>
      {post && (
        <HomeSection id="post" ref={postDiv}>
          <Stack w="full" spacing={10}>
            <HStack w={'full'} justify="space-between">
              {[...Array(6)].map((_, i) => (
                <Circle key={i} size="15px" bgColor={green} />
              ))}
            </HStack>
            <Grid templateColumns={['1fr', '1fr', '1fr', '1fr 1fr']} gap={4}>
              <GridItem
                display={'flex'}
                justifyContent={['center', 'center', 'center', 'flex-start']}
              >
                <Box boxSize={['xs', 'md', 'xl', '3xl']} position="relative">
                  <ChakraNextImage
                    placeholder="blur"
                    blurDataURL={post.image}
                    layout="fill"
                    objectFit="cover"
                    src={post.image}
                    quality={20}
                    alt="logo"
                    draggable={false}
                    rounded="3xl"
                  />
                </Box>
              </GridItem>
              <GridItem>
                <Stack h="100%">
                  <Box>
                    <Heading as="h2">{post.title}</Heading>
                    <CustomDivider />
                  </Box>
                  <Textarea
                    value={post.content}
                    fontSize={'lg'}
                    lineHeight={2}
                    isReadOnly
                    _focus={{}}
                    _hover={{}}
                    p={0}
                    border=""
                    minH="xl"
                  />
                  <Stack direction={['column', 'row', 'row', 'row']}>
                    <CustomButton
                      variant={'solid'}
                      onClick={() => sejaSocioDiv.current?.scrollIntoView()}
                    >
                      Seja Sócio
                    </CustomButton>
                    {post.buttonTarget && (
                      <CustomButton
                        variant={'outline'}
                        onClick={() => router.push(post.buttonTarget)}
                      >
                        Saiba mais
                      </CustomButton>
                    )}
                  </Stack>
                </Stack>
              </GridItem>
            </Grid>
            <HStack w={'full'} justify="space-between">
              {[...Array(6)].map((_, i) => (
                <Circle key={i} size="15px" bgColor={green} />
              ))}
            </HStack>
          </Stack>
        </HomeSection>
      )}
      <HomeSection ref={featuresDiv} id="features">
        <Grid templateColumns={['1fr', '1fr', '1fr', '1fr 2fr']} gap={4}>
          <GridItem>
            <Stack spacing={12}>
              <Box>
                <Heading as="h2">O MELHOR DA FÚRIA!</Heading>
                <CustomDivider />
              </Box>
              <Stack>
                <Card>
                  <HStack align="flex-start">
                    <CustomIconButton
                      variant={'solid'}
                      aria-label="esportes"
                      icon={<MdStore size="25px" />}
                      onClick={() => router.push('/store')}
                    />
                    <Stack p={2}>
                      <CustomLink
                        href="/store"
                        chakraLinkProps={{
                          _hover: {
                            color: green,
                          },
                          _focus: {},
                        }}
                      >
                        <Text fontSize={'xl'} fontWeight={'bold'}>
                          Loja
                        </Text>
                      </CustomLink>
                      <Text mb={4}>
                        Os produtos mais bonitos do Norteste estão aqui.
                      </Text>
                    </Stack>
                  </HStack>
                </Card>
                <Card>
                  <HStack align="flex-start">
                    <Stack>
                      <CustomIconButton
                        variant={'solid'}
                        aria-label="esportes"
                        icon={<FaVolleyballBall size="25px" />}
                        onClick={() => router.push('/activities')}
                      />

                      <CustomIconButton
                        variant={'solid'}
                        aria-label="bateria"
                        icon={<FaDrum size="25px" />}
                        onClick={() => router.push('/activities')}
                      />
                    </Stack>
                    <Stack p={2}>
                      <CustomLink
                        href="/activities"
                        chakraLinkProps={{
                          _hover: {
                            color: green,
                          },
                          _focus: {},
                        }}
                      >
                        <Text fontSize={'xl'} fontWeight={'bold'}>
                          Atividades
                        </Text>
                      </CustomLink>
                      <Text mb={4}>
                        Programação dos treinos de todas as modalidades e dos
                        ensaios da Carabina.
                      </Text>
                    </Stack>
                  </HStack>
                </Card>
                <Card>
                  <HStack align="flex-start">
                    <CustomIconButton
                      variant={'solid'}
                      aria-label="eventos"
                      icon={<GiPartyPopper size="25px" />}
                      onClick={() => router.push('/store')}
                    />
                    <Stack p={2}>
                      <CustomLink
                        href="/store"
                        chakraLinkProps={{
                          _hover: {
                            color: green,
                          },
                          _focus: {},
                        }}
                      >
                        <Text fontSize={'xl'} fontWeight={'bold'}>
                          Eventos
                        </Text>
                      </CustomLink>
                      <Text mb={4}>
                        Tenha uma experiência única com eventos padrão Fúria de
                        qualidade!
                      </Text>
                    </Stack>
                  </HStack>
                </Card>
              </Stack>
              <CustomButton
                variant={'solid'}
                onClick={() =>
                  sejaSocioDiv.current?.scrollIntoView({
                    block: 'start',
                    behavior: 'smooth',
                  })
                }
              >
                Quero ser Sócio!
              </CustomButton>
            </Stack>
          </GridItem>

          <GridItem
            display={'flex'}
            justifyContent={['center', 'center', 'center', 'flex-end']}
          >
            <Box boxSize={['xs', 'md', 'xl', '2xl']} position="relative">
              <ChakraNextImage
                placeholder="blur"
                blurDataURL={calango}
                layout="fill"
                objectFit="cover"
                src={calango}
                quality={100}
                alt="logo"
                mx="auto"
                draggable={false}
              />
            </Box>
          </GridItem>
        </Grid>
      </HomeSection>

      <HomeSection
        ref={sejaSocioDiv}
        bgColor={green}
        id="seja-socio"
        rounded={'3xl'}
        px={2}
      >
        <PageHeading as="h2" textColor={bg}>
          Junte-se à Fúria, <Text as="span">Seja sócio</Text>!
        </PageHeading>
        <Text fontSize="xl" textColor={bg} textAlign={'center'} mb={10}>
          Escolha abaixo o plano que melhor se adequa a você!
        </Text>
        <Box>
          <SejaSocioPricing />
        </Box>
      </HomeSection>
    </Layout>
  );
}

export const getStaticProps = async () => {
  export * from './Loja';
  const { data: featurePostData } = await client.query({
    query: gql`
      query {
        featurePost {
          id
          title
          content
          image
          buttonTarget
        }
      }
    `,
  });

  return {
    props: {
      post: featurePostData.featurePost,
    },
    revalidate: 60 * 60 * 1, // Every 1 hour
  };
};
