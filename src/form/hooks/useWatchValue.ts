import { useCallback, useState } from "react";
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

  const [value, setValue] = useState(
    () => form.internalState.values[_fieldName].value, // TODO:this must be accessed via getValueFor
  );

  const setNewValue = useCallback(<V extends typeof value>(newV: V) => {
    setValue(newV);
  }, []);

  form.internalState.values[_fieldName].observe("value", setNewValue);

  return value;
};
