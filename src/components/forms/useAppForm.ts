import { createFormHook } from '@tanstack/react-form';

import { NumberField } from '@/components/forms/number-field';

import { Checkbox } from './checkbox';
import { ComboboxField } from './combox-box';
import { DatePicker } from './date-picker';
import { ErrorMessages } from './error-message';
import { FormRoot } from './form-root';
import { InputPassword } from './input-password';
import { InputPhone } from './input-phone';
import { MultiSelect } from './multi-select';
import { SelectController } from './select';
import { SubscribeButton } from './subscribe-button';
import { Switch } from './switch';
import { TextArea } from './text-area';
import { TextField } from './text-field';
import { fieldContext, formContext } from './useFormContext';

export const { useAppForm, extendForm, useTypedAppFormContext, withFieldGroup, withForm } =
  createFormHook({
    fieldComponents: {
      TextField,
      NumberField,
      TextArea,
      Switch,
      Checkbox,
      MultiSelect,
      DatePicker,
      Select: SelectController,
      InputPassword: InputPassword,
      InputPhone: InputPhone,
      Combobox: ComboboxField
    },
    formComponents: {
      Submit: SubscribeButton,
      Root: FormRoot,
      ErrorMessages
    },
    fieldContext,
    formContext
  });
