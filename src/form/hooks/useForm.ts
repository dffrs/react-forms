import { useRef } from "react";
import { Form } from "..";

export const useForm = (name: string) => {
  const form = useRef(new Form(name));

  return form.current;
};
