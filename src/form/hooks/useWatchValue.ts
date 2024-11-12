import { useCallback, useEffect, useState } from "react";
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

  // useEffect(() => {
  //   form.internalState.values[_fieldName].observe("value", setNewValue);
  //
  //   return () => {
  //     form.internalState.values[_fieldName].remove("value", setNewValue);
  //   };
  // }, [form, _fieldName, setNewValue]);

  // NOTE: why ?????
  form.internalState.values[_fieldName].observe("value", setNewValue);

  return value;
};
