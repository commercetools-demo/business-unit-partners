/// <reference path="../../../@types-extensions/graphql-ctp/index.d.ts" />

import type { ApolloError, ApolloQueryResult } from '@apollo/client';
import {
  useMcMutation,
  useMcQuery,
} from '@commercetools-frontend/application-shell';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import RetrieveCustomObject from './fetch-bu.ctp.graphql';
import UpdateBU from './update-bu.ctp.graphql';
import { TMutation } from '../../types/generated/ctp';

type RetrieveCustomObjectProps = {
  id?: string;
  key?: string;
};

type BusinessUnit = {
  id: string;
  key: string;
  name: string;
  version: number;
  custom: {
    customFieldsRaw: {
      name: string;
      value: any;
    }[];
  };
};

type TUseRetrieveCustomObjectFetcher = (
  retrieveCustomObjectProps: RetrieveCustomObjectProps
) => {
  businessUnit: BusinessUnit | undefined | null;
  error?: ApolloError;
  loading: boolean;
  refetch(): Promise<
    ApolloQueryResult<{
      businessUnit?: BusinessUnit;
    }>
  >;
};
export const useRetrieveCustomObjectForBusinessUnit: TUseRetrieveCustomObjectFetcher =
  ({ id }) => {
    const { data, error, loading, refetch } = useMcQuery<
      {
        businessUnit?: BusinessUnit;
      },
      {
        id?: string;
        key?: string;
      }
    >(RetrieveCustomObject, {
      variables: {
        id: id,
      },
      context: {
        target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
      },
    });

    return {
      businessUnit: data?.businessUnit,
      error,
      loading,
      refetch,
    };
  };

export const useBusinessUnitUpdater = () => {
  const [updateProduct, { loading }] = useMcMutation<
    TMutation,
    {
      actions: NonNullable<Array<any>>;
      version: number;
      id?: string;
      key?: string;
    }
  >(UpdateBU);

  const execute = async ({
    actions,
    id,
    key,
    version,
    onCompleted,
    onError,
  }: {
    actions: NonNullable<Array<any>>;
    id?: string;
    key?: string;
    version: number;
    onCompleted?: () => void;
    onError?: (message?: string) => void;
  }) => {
    try {
      return await updateProduct({
        context: {
          target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
        },
        variables: {
          actions: actions,
          version: version,
          id: id,
          key: key,
        },
        onCompleted() {
          onCompleted && onCompleted();
        },
        onError({ message }) {
          onError && onError(message);
        },
      });
    } catch (graphQlResponse) {
      return graphQlResponse;
    }
  };

  return {
    loading,
    execute,
  };
};
