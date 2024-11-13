import { useCallback, useMemo, useState } from "react";
import { Form } from "../form";
import { Register } from "../types";

type Opts = {
  form: Form;
};

export const useWatchValue = (fieldName: Register, opts?: Opts) => {
  const { form } = opts ?? {};
  if (!form) throw Error("Form is not defined");

  const _fieldName =
    typeof fieldName === "string"
      ? fieldName
      : form.internalState.encodeFieldName(fieldName);

  const [value, setValue] = useState(() => form.getValueFor(_fieldName));

  const setNewValue = useCallback(<V>(newV: V) => {
    setValue(newV);
  }, []);

  useMemo(() => {
    form.internalState.values[_fieldName].observe("value", setNewValue);
  }, [_fieldName, form, setNewValue]);

  return value;
};
