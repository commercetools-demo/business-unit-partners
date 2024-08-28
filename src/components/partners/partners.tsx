import { useIntl } from 'react-intl';
import { useCustomViewContext } from '@commercetools-frontend/application-shell-connectors';
import { ContentNotification } from '@commercetools-uikit/notifications';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import PartnerList from './partner-list';
import PartnersWrapper from './partners-wrapper';
import {
  useCustomObjectFetcher,
  useCustomObjectsFetcher,
} from '../../hooks/use-custom-object-connector/use-custom-object-connector';
import { CUSTOM_OBJECTS_CONTAINER } from '../../constants';

const Partners = () => {
  const { hostUrl } = useCustomViewContext((context) => ({
    hostUrl: context.hostUrl,
  }));

  const { loading, customObjectsPaginatedResult } = useCustomObjectsFetcher({
    limit: 500,
    container: CUSTOM_OBJECTS_CONTAINER,
  });

  let businessUnitId: string | undefined = undefined;

  if (hostUrl) {
    const splittedUrl = hostUrl.split('/');
    const buIndex = splittedUrl.indexOf('business-units');

    if (buIndex === -1) {
      return (
        <ContentNotification type="error">
          <Text.Body>Cannot find business unit</Text.Body>
        </ContentNotification>
      );
    }
    businessUnitId = splittedUrl[buIndex + 1];
  } else {
    return (
      <ContentNotification type="error">
        <Text.Body>Cannot find host url</Text.Body>
      </ContentNotification>
    );
  }

  if (!businessUnitId) {
    return (
      <ContentNotification type="error">
        <Text.Body>Cannot find business unit</Text.Body>
      </ContentNotification>
    );
  }

  if (loading) {
    return (
      <ContentNotification type="info">
        <Text.Body>Loading...</Text.Body>
      </ContentNotification>
    );
  }

  if (!customObjectsPaginatedResult?.results?.length) {
    return (
      <ContentNotification type="info">
        <Text.Body>No partners found. Please start by adding one.</Text.Body>
      </ContentNotification>
    );
  }

  return (
    <Spacings.Stack scale="xl">
      <PartnersWrapper
        businessUnitId={businessUnitId}
        partners={customObjectsPaginatedResult.results}
      />
    </Spacings.Stack>
  );
};
Partners.displayName = 'Partners';

export default Partners;
