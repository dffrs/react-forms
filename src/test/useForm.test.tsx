import { useEffect, useRef, useState } from "react";
import { useForm } from "../form";
import { render } from "@testing-library/react";
import { InputType } from "./util";

describe("Form Tests: useForm", () => {
  it("should always have the same reference (internal state)", () => {
    const DummyComp = () => {
      const [_, setS] = useState(false);

      const form = useForm("dummy-form");

      expect(form).not.toBeFalsy();

      const initialFormRef = useRef(form);

      useEffect(() => {
        // Re-render by toggling the state
        setS((prev) => !prev);

        // Check that the form reference is still the same
        expect(form).toBe(initialFormRef.current);
      }, [form]);

      return null;
    };

    render(<DummyComp />);
  });

  it("should always have the same reference (Parent re-renders)", () => {
    const ChildComp = ({ form }: { form: any }) => {
      const internalRef = useRef(form);

      expect(form).toBe(internalRef.current);
      return null;
    };

    const DummyComp = () => {
      const [_, setS] = useState(false);

      const form = useForm("dummy-form");

      expect(form).not.toBeFalsy();

      useEffect(() => {
        // Re-render by toggling the state
        setS((prev) => !prev);
      }, []);

      return <ChildComp form={form}></ChildComp>;
    };

    render(<DummyComp />);
  });

  Object.entries({
    text: {
      descr: "text field",
      defaulValue: "test",
      expected: "test",
    },
    checkbox: {
      descr: "checkbox field",
      defaulValue: true,
      cb: (cont) => {
        expect(cont).toBeChecked();
      },
    },
  } as Record<
    InputType,
    {
      descr: string;
      defaulValue: unknown;
      expected?: any;
      cb?: (input: Element) => void;
    }
  >).forEach(([type, { descr, defaulValue, expected, cb }]) => {
    it("default value is injected into " + descr, () => {
      const InputComp = () => {
        const form = useForm("test", {
          defaultValues: { "test-input": defaulValue },
        });

        return <input type={type} {...form.register("test-input")} />;
      };

      const { container } = render(<InputComp />);

      const element = container.querySelector('input[name="test-input"]');

      if (element == null) throw Error("input not found");

      if (cb) cb(element);
      else expect(element).toHaveValue(expected);
    });
  });
});
