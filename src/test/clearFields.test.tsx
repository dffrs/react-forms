import { getByTestId, fireEvent, render } from "@testing-library/react";
import { useEffect } from "react";
import { useForm } from "../form";

describe("Form tests: clearFields", () => {
  it("clearFields clears all fields", () => {
    const InputComp = () => {
      const form = useForm("test", {
        defaultValues: {
          "dummy-input": "test",
          "dummy-number": 69,
          "dummy-checkbox": true,
          "dummy-radio": {
            opt1: true,
          },
        },
      });

      useEffect(() => {
        expect(form.getValues()).toEqual({
          ["dummy-input"]: "test",
          ["dummy-number"]: 69,
          ["dummy-checkbox"]: true,
          ["dummy-radio.opt1"]: true,
          ["dummy-radio.opt2"]: false,
        });
      }, [form]);

      return (
        <>
          <button data-testid="button" onClick={() => form.clearFields()}>
            click me
          </button>
          <input
            data-testid="input"
            type="text"
            {...form.register("dummy-input")}
          />
          <input
            data-testid="number"
            type="number"
            {...form.register("dummy-number")}
          />
          <input
            type="checkbox"
            id="checkboxId"
            data-testid="checkbox"
            {...form.register("dummy-checkbox")}
          />
          <label htmlFor="checkboxId">Test</label>
          <input
            type="radio"
            id="radio1"
            value="opt1"
            data-testid="radio1"
            {...form.register({ groupName: "dummy-radio", element: "opt1" })}
          />
          <label htmlFor="radio1">Option 1</label>
          <input
            type="radio"
            id="radio2"
            value="opt2"
            data-testid="radio2"
            {...form.register({ groupName: "dummy-radio", element: "opt2" })}
          />
          <label htmlFor="radio2">Option 2</label>
        </>
      );
    };

    const { container } = render(<InputComp />);

    const input = getByTestId(container, "input");
    if (!input) throw Error("input not found");

    const number = getByTestId(container, "number");
    if (!number) throw Error("input not found");

    const checkbox = getByTestId(container, "checkbox");
    if (!checkbox) throw Error("input not found");

    const radio1 = getByTestId(container, "radio1");
    if (!radio1) throw Error("input not found");

    const radio2 = getByTestId(container, "radio2");
    if (!radio2) throw Error("input not found");

    const button = getByTestId(container, "button");
    if (!button) throw Error("button not found");

    // default value should be present on all inputs
    expect(input).toHaveValue("test");
    expect(number).toHaveValue(69);
    expect(checkbox).toBeChecked();
    expect(radio1).toBeChecked();
    expect(radio2).not.toBeChecked();

    // click on button to clear all fields
    fireEvent.click(button);

    // validate input values
    expect(input).toHaveValue("");
    expect(number).toHaveValue(null);
    expect(checkbox).not.toBeChecked();
    expect(radio1).not.toBeChecked();
    expect(radio2).not.toBeChecked();
  });
});
