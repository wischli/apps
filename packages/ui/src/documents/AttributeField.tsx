import React, { FunctionComponent } from 'react';
import { NumberInput } from '@centrifuge/axis-number-input';
import { DateInput } from '@centrifuge/axis-date-input';
import { Attribute, AttrTypes } from '@centrifuge/gateway-lib/models/schema';
import { Box, FormField, Select, TextInput } from 'grommet';
import { dateToString, extractDate, getPercentFormat } from '@centrifuge/gateway-lib/utils/formaters';
import { get } from 'lodash';
import { connect, FormikContext } from 'formik';
import { Document } from '@centrifuge/gateway-lib/models/document';

type Props = OuterProps & {
  formik: FormikContext<Document>
};


interface OuterProps {
  attr: Attribute;
  isViewMode?: boolean;
}

export const AttributeField: FunctionComponent<Props> = (props: Props) => {

  const {
    attr,
    isViewMode,
    formik: {
      values,
      errors,
      handleChange,
      setFieldValue,
    },
  } = props;

  const key = `attributes.${attr.name}.value`;

  const commonProps = {
    name: key,
    value: get(values, key) || attr.defaultValue,
    disabled: isViewMode,
    placeholder: attr.placeholder,
  };

  return <Box><FormField
    key={key}
    label={attr!.label}
    error={get(errors, key)}
  >
    {(() => {

      if (attr.options && attr.options.length > 0) {
        return <Select
          disabled={isViewMode}
          options={attr.options}
          {...commonProps}
          onChange={({ value }) => {
            setFieldValue(`${key}`, value.toString());
          }}
        />;
      }

      switch (attr.type) {
        case AttrTypes.STRING:
          return <TextInput
            {...commonProps}
            onChange={handleChange}
          />;
        case AttrTypes.BYTES:
          return <TextInput
            {...commonProps}
            onChange={handleChange}
          />;
        case AttrTypes.INTEGER:
          return <NumberInput
            {...commonProps}
            precision={0}
            onChange={({ value }) => {
              setFieldValue(`${key}`, value);
            }}
          />;
        case AttrTypes.DECIMAL:
          return <NumberInput
            {...commonProps}
            onChange={({ value }) => {
              setFieldValue(`${key}`, value);
            }}
          />;

        case AttrTypes.PERCENT:

          const percentParts = getPercentFormat();
          return <NumberInput
            {...commonProps}
            {...percentParts}
            onChange={({ value }) => {
              setFieldValue(`${key}`, value);
            }}
          />;

        case AttrTypes.TIMESTAMP:
          return <DateInput
            {...commonProps}
            value={extractDate(get(values, key))}
            onChange={date => {
              setFieldValue(`${key}`, dateToString(date));
            }}
          />;
      }
    })()}
  </FormField></Box>;
};

export default connect<OuterProps>(AttributeField);
