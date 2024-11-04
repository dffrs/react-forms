import { render } from "@testing-library/react";
import { useForm } from "../form/hooks/useForm";
import { Form, useWatchValue } from "../form";

describe("Form Test: useWatchValue", () => {
  it("listens to value change", () => {
    const ChildComp = ({ form }: { form: Form }) => {
      const value = useWatchValue("text-input", { form });

      // @ts-ignore
      return <span>{value}</span>;
    };

    const InputComp = () => {
      const form = useForm("test-form");

      return (
        <>
          <input type="text" {...form.register("text-input")} />
          <ChildComp form={form} />
        </>
      );
    };

    render(<InputComp />);
  });
});
