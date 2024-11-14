import { FC, PropsWithChildren } from "react";
import { FormContext } from ".";
import { Form } from "../../form";

export const FormProvider: FC<PropsWithChildren<{ form: Form }>> = ({
  form,
  children,
}) => {
  return <FormContext.Provider value={form}>{children}</FormContext.Provider>;
};
