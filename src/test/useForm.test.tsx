import { useEffect, useRef, useState } from "react";
import { useForm } from "../form";
import { render } from "@testing-library/react";

describe("Form Tests: useForm", () => {
  it("should always have the same reference (internal state)", () => {
    const DummyComp = () => {
      const [_, setS] = useState(false);

      const form = useForm("dummy-form");
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

      useEffect(() => {
        // Re-render by toggling the state
        setS((prev) => !prev);
      }, []);

      return <ChildComp form={form}></ChildComp>;
    };

    render(<DummyComp />);
  });
});
