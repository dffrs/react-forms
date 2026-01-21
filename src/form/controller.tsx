import { Form } from "./form";
import { useFormContext } from "./hooks/formContext";
import { useWatchValue } from "./hooks/useWatchValue";
import { Register } from "./types";

type Props = {
  fieldName: Register;
  form?: Form;
  // TODO: Provide 'ref' and maybe 'onChange'
  children: (args: { ref: unknown; value: unknown }) => React.ReactNode;
};

export const Controller = ({ fieldName, form, children }: Props) => {
  const _form = useFormContext(form);
  const value = useWatchValue(fieldName, { form: _form });

  // NOTE: this won't work. I'm getting a ref for a field that I have NOT register before...
  return children({ ref: _form.getInputRef(fieldName), value: value });
};
