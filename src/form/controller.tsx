import { Form } from "./form";
import { useFormContext } from "./hooks/formContext";
import { useWatchValue } from "./hooks/useWatchValue";
import { CustomSelect, Register } from "./types";

type Props = {
  fieldName: Register;
  form?: Form;
  // TODO: Provide 'onChange'
  children: (args: {
    ref: (
      input: HTMLInputElement | CustomSelect | HTMLTextAreaElement | null,
    ) => HTMLInputElement | CustomSelect | HTMLTextAreaElement | null;
    value: unknown;
  }) => React.ReactNode;
};

export const Controller = ({ fieldName, form, children }: Props) => {
  const _form = useFormContext(form);

  return children({
    ref: _form.register(fieldName)["ref"],
    value: useWatchValue(fieldName, { form: _form }),
  });
};
