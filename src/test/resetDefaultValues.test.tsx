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

  it("resetToDefaultValues (without fieldName) resets ALL values to default value", async () => {
    const InputComp = () => {
      const form = useForm("test", {
        defaultValues: {
          "dummy-input": "test",
          "dummy-checkbox": true,
        },
      });

      useEffect(() => {
        expect(form.getValues()).toEqual({
          ["dummy-input"]: "test",
          ["dummy-checkbox"]: true,
        });
      }, [form]);

      return (
        <>
          <button
            data-testid="button"
            onClick={() => form.resetToDefaultValues()}
          >
            click me
          </button>
          <input
            data-testid="input"
            type="text"
            {...form.register("dummy-input")}
          />
          <input
            data-testid="checkbox"
            type="checkbox"
            {...form.register("dummy-checkbox")}
          />
        </>
      );
    };

    const { container } = render(<InputComp />);

    const input = getByTestId(container, "input");
    if (!input) throw Error("input not found");

    const checkbox = getByTestId(container, "checkbox") as HTMLInputElement;
    if (!checkbox) throw Error("checkbox not found");

    const button = getByTestId(container, "button");
    if (!button) throw Error("button not found");

    // default value should be present on input & checkbox
    expect(input).toHaveValue("test");
    expect(checkbox).toBeChecked();

    // input random text to input and uncheck checkbox
    fireEvent.change(input, { target: { value: "new value" } });
    fireEvent.click(checkbox);

    expect(input).toHaveValue("new value");
    expect(checkbox).not.toBeChecked();

    // click on button to reset values
    fireEvent.click(button);

    // validate that input has default value again
    expect(input).toHaveValue("test");
    expect(checkbox).toBeChecked();
  });

  it("resetToDefaultValues does nothing if input didn't have any default value specified", async () => {
    const InputComp = () => {
      const form = useForm("test");

      useEffect(() => {
        expect(form.getValues()).toEqual({ "dummy-input": "" }); // no value
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
    expect(input).toHaveValue("");

    // input random text to input
    fireEvent.change(input, { target: { value: "new value" } });
    expect(input).toHaveValue("new value");

    // click on button to reset values
    fireEvent.click(button);

    // validate that input still has the same value as before
    expect(input).toHaveValue("new value");
  });
});
