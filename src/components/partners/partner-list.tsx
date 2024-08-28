import React, { useMemo } from 'react';
import { FieldArray, Form, Formik } from 'formik';
import Spacings from '@commercetools-uikit/spacings';
import SelectField from '@commercetools-uikit/select-field';
import PrimaryButton from '@commercetools-uikit/primary-button';
import IconButton from '@commercetools-uikit/icon-button';
import { CloseIcon, PlusBoldIcon } from '@commercetools-uikit/icons';
import { TCustomObject } from '../../types/generated/ctp';

type Props = {
  businessUnitId: string;
  customObjects: { id: string; typeId: 'key-value-document' }[];
  partners: TCustomObject[];
  onSave: (customObjects: TCustomObject['value'][]) => Promise<void>;
};

const PartnerList = ({
  businessUnitId,
  customObjects,
  partners,
  onSave,
}: Props) => {
  const options = useMemo(() => {
    return partners.map((partner) => ({
      label: `${partner.key} (type: ${partner.value.partnerType}, number: ${partner.value.partnerNumber})`,
      value: partner.id,
    }));
  }, [partners]);

  const onValidate = (values) => {
    const errors: any = {};
    const customObjectIds = values.customObjects.map(
      (customObject) => customObject.id
    );
    const duplicates = customObjectIds.filter(
      (id, index) => customObjectIds.indexOf(id) !== index
    );

    if (duplicates.length > 0) {
      errors.customObjects = `Duplicate IDs: ${duplicates.join(', ')}`;
    }
    if (values.customObjects.some((customObject) => !customObject.id)) {
      errors.customObjects = 'Missing ID';
    }

    return errors;
  };
  return (
    <Spacings.Stack>
      <Formik
        initialValues={{
          customObjects,
        }}
        validate={onValidate}
        validateOnBlur
        onSubmit={(values) => {
          onSave(values.customObjects);
        }}
      >
        {({ values, errors, handleChange, submitForm, dirty }) => (
          <Form>
            <div style={{ paddingBottom: '16px' }}>
              <FieldArray name="customObjects">
                {({ insert, remove, push }) => (
                  <Spacings.Stack>
                    {values.customObjects.map((customObject, index) => (
                      <Spacings.Inline
                        key={customObject.id}
                        alignItems="flex-end"
                      >
                        <SelectField
                          title={`Partner ${index + 1}`}
                          name={`customObjects.${index}.id`}
                          value={customObject.id}
                          onChange={handleChange}
                          options={options}
                        />
                        <input
                          type="hidden"
                          name={`customObjects.${index}.typeId`}
                          value={customObject.typeId}
                        />
                        <IconButton
                          type="button"
                          label="Remove"
                          onClick={() => remove(index)}
                          icon={<CloseIcon />}
                        />
                      </Spacings.Inline>
                    ))}
                    <IconButton
                      type="button"
                      label="Add"
                      icon={<PlusBoldIcon />}
                      onClick={() =>
                        push({ id: '', typeId: 'key-value-document' })
                      }
                    />
                  </Spacings.Stack>
                )}
              </FieldArray>
              {errors.customObjects && (
                <p style={{ color: 'red' }}>{errors.customObjects}</p>
              )}
            </div>
            <PrimaryButton
              label="Save"
              onClick={submitForm}
              isDisabled={!!errors.customObjects || !dirty}
            />
          </Form>
        )}
      </Formik>
    </Spacings.Stack>
  );
};

export default PartnerList;
