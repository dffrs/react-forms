import { getByTestId, fireEvent, render } from "@testing-library/react";
import { useEffect } from "react";
import { useForm } from "../form";

describe("Reset to Default Values tests", () => {
  it("resetToDefaultValues (with fieldName) resets value to default value", async () => {
    const InputComp = () => {
      const form = useForm("test", {
        defaultValues: { "dummy-input": "test" },
      });

      useEffect(() => {
        expect(form.getValues()).toEqual({ ["dummy-input"]: "test" });
      }, [form]);

      return (
        <>
          <button
            data-testid="button"
            onClick={() => form.resetToDefaultValues("dummy-input")}
          >
            click me
          </button>
          <input
            data-testid="input"
            type="text"
            {...form.register("dummy-input")}
          />
        </>
      );
    };

    const { container } = render(<InputComp />);

    const input = getByTestId(container, "input");
    if (!input) throw Error("input not found");

    const button = getByTestId(container, "button");
    if (!button) throw Error("button not found");

    // default value should be present on input
    expect(input).toHaveValue("test");

    // input random text to input
    fireEvent.change(input, { target: { value: "new value" } });
    expect(input).toHaveValue("new value");

    // click on button to reset values
    fireEvent.click(button);

    // validate that input has default value again
    expect(input).toHaveValue("test");
  });
});
