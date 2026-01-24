import { ChangeEvent, useMemo } from "react";
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
    onChange: <V extends HTMLInputElement | CustomSelect | HTMLTextAreaElement>(
      ev: ChangeEvent<V>,
    ) => boolean;
    value: unknown;
  }) => React.ReactNode;
};

export const Controller = ({ fieldName, form, children }: Props) => {
  const _form = useFormContext(form);

  const registerValues = useMemo(
    () => _form.register(fieldName),
    [_form, fieldName],
  );

  return children({
    ref: registerValues["ref"],
    value: useWatchValue(fieldName, { form: _form }),
    onChange: registerValues["onChange"],
  });
};
