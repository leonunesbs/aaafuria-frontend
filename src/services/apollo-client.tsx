import { ApolloClient, DefaultOptions, InMemoryCache } from '@apollo/client';

import { createUploadLink } from 'apollo-upload-client';

const defaultOptions: DefaultOptions = {
  watchQuery: {
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'ignore',
  },
  query: {
    fetchPolicy: 'cache-first',
    errorPolicy: 'all',
  },
};

const uploadLink = createUploadLink({
  uri:
    process.env.NODE_ENV === 'development'
      ? 'http://192.168.5.155:8000/graphql'
      : `${process.env.BACKEND_DOMAIN}/graphql`,
  credentials: 'same-origin',
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: uploadLink as any,
  defaultOptions: defaultOptions,
});

export default client;
