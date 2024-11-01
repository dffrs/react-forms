import { useEffect, useRef, useState } from "react";
import { useForm } from "../form";
import { render } from "@testing-library/react";

describe("Form Tests: useForm", () => {
  it("should always have the same reference", () => {
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
});
