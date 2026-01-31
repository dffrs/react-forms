import { useCallback, useMemo, useState } from "react";
import { Form } from "../form";
import { Register } from "../types";
import { useFormContext } from "./formContext";

type Opts = {
  form?: Form;
};

export const useWatchError = (fieldName: Register, opts?: Opts) => {
  const form = useFormContext(opts?.form);

  const _fieldName = form.internalState.simplifyFieldName(fieldName);

  const [error, setError] = useState(() => form.getErrorFor(_fieldName));

  const setNewError = useCallback((newV: string | undefined) => {
    setError(newV);
  }, []);

  useMemo(() => {
    form.internalState.errors[_fieldName].observe("error", setNewError);
  }, [_fieldName, form, setNewError]);

  return error;
};
