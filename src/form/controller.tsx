import { ChangeEvent, useMemo } from "react";
import { Form } from "./form";
import { useFormContext } from "./hooks/formContext";
import { useWatchValue } from "./hooks/useWatchValue";
import { FormRefs, Register } from "./types";

type Props = {
  fieldName: Register;
  form?: Form;
  children: (args: {
    ref: (input: FormRefs | null) => FormRefs | null;
    onChange: <V extends FormRefs>(ev: ChangeEvent<V>) => boolean;
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
    onChange: registerValues["onChange"],
    value: useWatchValue(fieldName, { form: _form }),
  });
};
