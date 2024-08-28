import { ApolloError } from '@apollo/client';

export const getErrorMessage = (error: ApolloError) =>
  error.graphQLErrors?.map((e) => e.message).join('\n') || error.message;

export const extractErrorFromGraphQlResponse = (graphQlResponse: unknown) => {
  if (graphQlResponse instanceof ApolloError) {
    return getErrorMessage(graphQlResponse);
  }

  return graphQlResponse;
};
