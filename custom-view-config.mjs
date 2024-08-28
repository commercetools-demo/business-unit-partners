/**
 * @type {import('@commercetools-frontend/application-config').ConfigOptionsForCustomView}
 */
const config = {
  name: 'Custom Object Viewer',
  cloudIdentifier: '${env:CLOUD_IDENTIFIER}',
  mcApiUrl: '${env:MC_API_URL}',
  env: {
    development: {
      initialProjectKey: '${env:INITIAL_PROJECT_KEY}',
      hostUriPath:
        '/${env:INITIAL_PROJECT_KEY}/customers/business-units/a52ab37c-bd8b-4400-82bf-9f0ae9d880e2/general',
    },
    production: {
      customViewId: '${env:CUSTOM_VIEW_ID}',
      url: '${env:APPLICATION_URL}',
    },
  },
  oAuthScopes: {
    view: ['view_business_units', 'view_key_value_documents'],
    manage: ['manage_business_units', 'manage_key_value_documents'],
  },
  type: 'CustomPanel',
  typeSettings: {
    size: 'SMALL',
  },
  locators: ['customers.business_unit_details.general'],
};

export default config;
