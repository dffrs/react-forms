import { useRef } from "react";
import { Form, type Options } from "..";

export const useForm = (name: string, opt?: Options) => {
  const form = useRef(new Form(name, opt));

  return form.current;
};
