import { createContext, useContext } from "react";
import { Form } from "../../form";

export const FormContext = createContext<Form | null>(null);

export const useFormContext = (formFallback?: Form) => {
  const form = useContext(FormContext) ?? formFallback;

  if (form == null)
    throw new Error(
      "[Error-useFormContext]: No FormProvider detected nor fallback has been provided",
    );

  return form;
};
