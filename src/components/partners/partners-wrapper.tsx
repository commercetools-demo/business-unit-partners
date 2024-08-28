import React from 'react';
import {
  useBusinessUnitUpdater,
  useRetrieveCustomObjectForBusinessUnit,
} from '../../hooks/use-business-unit-connector/use-bu-connector';
import { ContentNotification } from '@commercetools-uikit/notifications';
import Text from '@commercetools-uikit/text';
import { getErrorMessage } from '../../helpers';
import {
  CUSTOM_TYPE_FIELD,
  CUSTOM_OBJECTS_CONTAINER,
  CUSTOM_TYPE_KEY,
} from '../../constants';
import Spacings from '@commercetools-uikit/spacings';
import PrimaryButton from '@commercetools-uikit/primary-button';
import { useCustomObjectUpdater } from '../../hooks/use-custom-object-connector/use-custom-object-connector';
import { useShowNotification } from '@commercetools-frontend/actions-global';
import {
  DOMAINS,
  NOTIFICATION_KINDS_SIDE,
} from '@commercetools-frontend/constants';
import PartnerList from './partner-list';
import { TCustomObject } from '../../types/generated/ctp';

type Props = {
  businessUnitId: string;
  partners: TCustomObject[];
};

const PartnersWrapper = ({ businessUnitId, partners }: Props) => {
  const showNotification = useShowNotification();

  const { businessUnit, error, loading, refetch } =
    useRetrieveCustomObjectForBusinessUnit({
      id: businessUnitId,
    });

  const businessUnitUpdater = useBusinessUnitUpdater();

  const customObjectUpdater = useCustomObjectUpdater();

  if (error) {
    return (
      <ContentNotification type="error">
        <Text.Body>{getErrorMessage(error)}</Text.Body>
      </ContentNotification>
    );
  }

  const onCreateCustomField = async (
    fieldValues: TCustomObject['value'][] = []
  ) => {
    await businessUnitUpdater.execute({
      actions: [
        {
          setCustomType: {
            type: {
              key: CUSTOM_TYPE_KEY,
              typeId: 'type',
            },
            fields: [
              {
                name: CUSTOM_TYPE_FIELD,
                value: JSON.stringify(fieldValues),
              },
            ],
          },
        },
      ],
      version: businessUnit?.version!,
      id: businessUnitId,
    });
    refetch();
  };

  const handleSave = async (customObjects: TCustomObject['value'][]) => {
    console.log(customObjects);
    await onCreateCustomField(customObjects);
    showNotification({
      kind: NOTIFICATION_KINDS_SIDE.success,
      domain: DOMAINS.SIDE,
      text: 'Partner list saved successfully',
    });
  };

  const attribute = businessUnit?.custom?.customFieldsRaw?.find(
    (attribute) => attribute.name === CUSTOM_TYPE_FIELD
  );

  if (!attribute) {
    return (
      <Spacings.Stack alignItems={'flexStart'}>
        <ContentNotification type="info">
          <Text.Body>
            {`Attribute with name "${CUSTOM_TYPE_FIELD}" cannot be found.`}
          </Text.Body>
        </ContentNotification>
        <PrimaryButton
          label={`create and link`}
          onClick={onCreateCustomField}
        />
      </Spacings.Stack>
    );
  }

  const referencedResources = attribute.value;
  if (!referencedResources) {
    return (
      <ContentNotification type="info">
        <Text.Body>{`Attribute "${CUSTOM_TYPE_FIELD}" does not contain a correct value`}</Text.Body>
      </ContentNotification>
    );
  }

  return (
    <Spacings.Stack>
      <Text.Headline as="h1">Partner list of {businessUnit?.key}</Text.Headline>
      <PartnerList
        businessUnitId={businessUnitId}
        customObjects={referencedResources}
        partners={partners}
        onSave={handleSave}
      />
    </Spacings.Stack>
  );
};

export default PartnersWrapper;
