import { useCallback, useMemo, useState } from "react";
import { Form } from "../form";
import { Register } from "../types";
import { useFormContext } from "./formContext";

type Opts = {
  form?: Form;
  // NOTE: if value is NOT a primitive type, a compare function can be provided
  // to compare 'old value' to 'new value' before calling 'setState'
  // This way, we safe a few re-renders (and even infinite loops)
  compareFn?: <NV, OV>(newV: NV, oldV: OV) => boolean;
};

export const useWatchValue = (fieldName: Register, opts?: Opts) => {
  const form = useFormContext(opts?.form);

  const _fieldName = form.internalState.simplifyFieldName(fieldName);

  const [value, setValue] = useState(() => form.getValueFor(_fieldName));

  const setNewValue = useCallback(
    <V>(newV: V, oldV: V) => {
      const compareFunction = opts?.compareFn ? opts?.compareFn : () => false;

      if (compareFunction(newV, oldV)) return;
      setValue(newV);
    },
    [opts?.compareFn],
  );

  useMemo(() => {
    form.internalState.values[_fieldName].observe("value", setNewValue);
  }, [_fieldName, form, setNewValue]);

  return value;
};
