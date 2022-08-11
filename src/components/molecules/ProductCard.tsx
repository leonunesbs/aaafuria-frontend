import * as gtag from 'libs/gtag';

import { AuthContext, ColorContext } from '@/contexts';
import {
  Box,
  FormControl,
  FormHelperText,
  Heading,
  Image,
  Input,
  Select,
  Stack,
  useBreakpointValue,
  useToast,
} from '@chakra-ui/react';
import { CustomButton, PriceTag } from '../atoms';
import { SubmitHandler, useForm } from 'react-hook-form';
import { gql, useMutation } from '@apollo/client';
import { useCallback, useContext, useState } from 'react';

import { Card } from '../templates';
import { MdShoppingCart } from 'react-icons/md';
import { ProductType } from '@/pages/store';
import { useRouter } from 'next/router';

const ADD_TO_CART = gql`
  mutation addToCart(
    $itemId: ID!
    $quantity: Int!
    $description: String
    $userUsername: String
  ) {
    addToCart(
      itemId: $itemId
      quantity: $quantity
      description: $description
      userUsername: $userUsername
    ) {
      ok
    }
  }
`;

interface ProductCardProps {
  node: ProductType;
  clientRegistration?: string | null;
}

export function ProductCard({
  node: product,
  clientRegistration,
}: ProductCardProps) {
  const router = useRouter();
  const [variationId, setVariationId] = useState('');
  const [subVariationId, setSubVariationId] = useState('');
  const [underVariationId, setUnderVariationId] = useState('');
  const { green } = useContext(ColorContext);
  const { isAuthenticated, token, user } = useContext(AuthContext);
  const { register, handleSubmit } = useForm<any>();

  const addToCartBreakpoint = useBreakpointValue(['', 'Adicionar ao carrinho']);
  const fontSize = useBreakpointValue(['xs', 'sm']);

  const [addToCart, { loading }] = useMutation(ADD_TO_CART, {
    context: {
      headers: {
        Authorization: `JWT ${token || ' '}`,
      },
    },
  });

  const toast = useToast();

  const onSubmit: SubmitHandler<any> = useCallback(
    async (formData) => {
      if (!isAuthenticated) {
        router.push(`/login?after=${router.asPath}`);
      }
      const productId =
        underVariationId ||
        subVariationId ||
        variationId ||
        formData.variacaoId ||
        product.id;
      const quantidade = 1;
      const observacoes = formData.observacoes;

      await addToCart({
        variables: {
          itemId: productId,
          quantity: quantidade,
          description: observacoes,
          userUsername: clientRegistration,
        },
      })
        .then(() => {
          toast({
            title: `[${product.name}] adicionado ao carrinho ${
              clientRegistration ? ' de ' + clientRegistration : ''
            }!`,
            description: (
              <CustomButton
                colorScheme={'green'}
                variant="solid"
                leftIcon={<MdShoppingCart size="25px" />}
                shadow="base"
                onClick={() => router.push('/store/cart')}
              >
                Ir para o carrinho
              </CustomButton>
            ),
            status: 'success',
            isClosable: true,
            duration: 2500,
            position: 'top-left',
          });
          gtag.event({
            action: 'add_to_cart',
            category: 'ecommerce',
            label: product.name,
            value: 1,
            items: [
              {
                id: product.id,
                price: product.price,
                name: product.name,
                quantity: 1,
              },
            ],
          });
        })
        .catch((error) => {
          toast({
            title: 'Erro',
            description: error.message,
            status: 'warning',
            duration: 2500,
            isClosable: true,
            position: 'top-left',
          });
          return;
        });
    },
    [
      isAuthenticated,
      underVariationId,
      subVariationId,
      variationId,
      product.id,
      product.name,
      product.price,
      addToCart,
      clientRegistration,
      router,
      toast,
    ],
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card key={product.id} px="0" py="0" overflow={'hidden'}>
        <Image
          w="full"
          objectFit="cover"
          src={product.image}
          mx="auto"
          alt={product.name}
        />
        <Card rounded={0}>
          <Box mb={2}>
            <Heading as="h3" size={fontSize}>
              {product.name.toUpperCase()}
            </Heading>
            <PriceTag
              as="h4"
              fontSize={['md', 'lg']}
              price={product.price as number}
              discountedPrice={product.membershipPrice}
            />
          </Box>
          <Stack spacing={0.5}>
            <FormControl
              display={
                product?.variations?.edges.length > 0 ? 'default' : 'none'
              }
            >
              <Select
                size="xs"
                rounded={'lg'}
                focusBorderColor={green}
                placeholder="Selecione uma opção"
                required={product?.variations?.edges.length > 0}
                {...register('variacaoId', {
                  onChange: (e) => setVariationId(e.target.value),
                })}
              >
                {product.variations.edges.map(
                  ({ node }) =>
                    node.isActive && (
                      <option key={node.id} value={node.id}>
                        {node.name}
                      </option>
                    ),
                )}
              </Select>
            </FormControl>
            <FormControl
              display={
                product?.variations?.edges.filter(
                  ({ node }) => node.variations.edges.length > 0,
                ).length > 0
                  ? 'default'
                  : 'none'
              }
              isDisabled={!variationId}
            >
              <Select
                size="xs"
                rounded={'lg'}
                focusBorderColor={green}
                placeholder="Selecione uma opção"
                required={
                  product?.variations?.edges.filter(
                    ({ node }) => node.variations.edges.length > 0,
                  ).length > 0
                }
                onChange={(e) => setSubVariationId(e.target.value)}
              >
                {product.variations.edges.map(({ node: variation }) =>
                  variation.variations.edges.map(
                    ({ node: subVariation }) =>
                      subVariation.refItem.id == variationId &&
                      subVariation.isActive && (
                        <option key={subVariation.id} value={subVariation.id}>
                          {subVariation.name}
                        </option>
                      ),
                  ),
                )}
              </Select>
            </FormControl>
            <FormControl
              display={
                product?.variations?.edges.filter(
                  ({ node }) =>
                    node.variations.edges.filter(
                      ({ node }) => node.variations.edges.length > 0,
                    ).length > 0,
                ).length > 0
                  ? 'default'
                  : 'none'
              }
              isDisabled={!subVariationId}
            >
              <Select
                size="xs"
                rounded={'lg'}
                focusBorderColor={green}
                placeholder="Selecione uma opção"
                required={
                  product?.variations?.edges.filter(
                    ({ node }) =>
                      node.variations.edges.filter(
                        ({ node }) => node.variations.edges.length > 0,
                      ).length > 0,
                  ).length > 0
                }
                onChange={(e) => setUnderVariationId(e.target.value)}
              >
                {product.variations.edges.map(({ node: variation }) =>
                  variation.variations.edges.map(({ node: subVariation }) =>
                    subVariation.variations.edges.map(
                      ({ node: underVariation }) =>
                        underVariation.refItem.id == subVariationId &&
                        underVariation.isActive && (
                          <option
                            key={underVariation.id}
                            value={underVariation.id}
                          >
                            {underVariation.name}
                          </option>
                        ),
                    ),
                  ),
                )}
              </Select>
            </FormControl>
            <FormControl display={product?.hasDescription ? 'default' : 'none'}>
              <Input
                rounded={'lg'}
                size="xs"
                focusBorderColor={green}
                required={product?.hasDescription}
                placeholder="Observações"
                {...register('observacoes')}
              />
              <FormHelperText fontSize={'xx-small'}>
                ex.: Nome: Joãozinho Nº: 10
              </FormHelperText>
            </FormControl>
          </Stack>
        </Card>

        {isAuthenticated ? (
          product.membershipExclusive ? (
            <CustomButton
              w="full"
              type="submit"
              rounded="0"
              leftIcon={<MdShoppingCart size="20px" />}
              isLoading={loading}
              loadingText="Adicionando..."
              variant={'solid'}
              isDisabled={!user?.member.hasActiveMembership}
            >
              {user?.member.hasActiveMembership
                ? addToCartBreakpoint
                : 'PRODUTO EXCLUSIVO'}
            </CustomButton>
          ) : (
            <CustomButton
              w="full"
              type="submit"
              rounded="0"
              leftIcon={<MdShoppingCart size="20px" />}
              isLoading={loading}
              loadingText="Adicionando..."
              variant={'solid'}
            >
              {addToCartBreakpoint}
            </CustomButton>
          )
        ) : (
          <CustomButton
            w="full"
            type="submit"
            rounded="0"
            leftIcon={<MdShoppingCart size="20px" />}
            isLoading={loading}
            loadingText="Adicionando..."
            variant={'solid'}
            isDisabled={
              product.membershipExclusive
                ? !user?.member.hasActiveMembership ?? true
                : false
            }
          >
            Faça login para comprar
          </CustomButton>
        )}
      </Card>
    </form>
  );
}
