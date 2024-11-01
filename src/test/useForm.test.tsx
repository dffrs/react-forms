import { useEffect, useRef, useState } from "react";
import { useForm } from "../form";
import { render } from "@testing-library/react";

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

  it("default value is injected into field (text)", () => {
    const InputComp = () => {
      const form = useForm("test", {
        defaultValues: { "test-input": "this is a test" },
      });

      return <input type="text" {...form.register("test-input")} />;
    };

    const { container } = render(<InputComp />);

    expect(container.querySelector('input[name="test-input"]')).toHaveValue(
      "this is a test",
    );
  });

  it("default value is injected into field (checkbox)", () => {
    const InputComp = () => {
      const form = useForm("test", {
        defaultValues: { "test-checkbox": true },
      });

      return <input type="checkbox" {...form.register("test-checkbox")} />;
    };

    const { container } = render(<InputComp />);

    expect(
      container.querySelector('input[name="test-checkbox"]'),
    ).toBeChecked();
  });
});
