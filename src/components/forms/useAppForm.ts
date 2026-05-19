import { createFormHook } from '@tanstack/react-form';
import { Checkbox } from './checkbox';
import { ComboboxField } from './combox-box';
import { DatePicker } from './date-picker';
import { ErrorMessages } from './error-message';
import { FormRoot } from './form-root';
import { InputPhone } from './input-from';
import { InputPassword } from './input-password';
import { MultiSelect } from './multi-select';
import { SelectController } from './select';
import { SubscribeButton } from './subscribe-button';
import { Switch } from './switch';
import { TextArea } from './text-area';
import { TextField } from './text-field';
import { fieldContext, formContext } from './useFormContext';

export const { useAppForm } = createFormHook({
  fieldComponents: {
    TextField,
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


export type AppFormApi = ReturnType<typeof useAppForm>;
