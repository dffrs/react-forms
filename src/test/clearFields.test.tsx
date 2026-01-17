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
          "dummy-select": "option-1",
        },
      });

      useEffect(() => {
        expect(form.getValues()).toEqual({
          ["dummy-input"]: "test",
          ["dummy-number"]: 69,
          ["dummy-checkbox"]: true,
          ["dummy-radio.opt1"]: true,
          ["dummy-radio.opt2"]: false,
          ["dummy-select"]: "option-1",
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
          <select data-testid="select" {...form.register("dummy-select")}>
            <option data-testid="select-option-1" value="option-1">
              option 1
            </option>
            <option data-testid="select-option-2" value="option-2">
              option 2
            </option>
            <option data-testid="select-option-3" value="option-3">
              option 3
            </option>
          </select>
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

    const select = getByTestId<HTMLSelectElement>(container, "select");
    if (!select) throw Error("input not found");

    const option1 = getByTestId<HTMLOptionElement>(
      container,
      "select-option-1",
    );
    if (!option1) throw Error("option not found");

    const option2 = getByTestId<HTMLOptionElement>(
      container,
      "select-option-2",
    );
    if (!option2) throw Error("option not found");

    const option3 = getByTestId<HTMLOptionElement>(
      container,
      "select-option-3",
    );
    if (!option3) throw Error("option not found");

    const button = getByTestId(container, "button");
    if (!button) throw Error("button not found");

    // default value should be present on all inputs
    expect(input).toHaveValue("test");
    expect(number).toHaveValue(69);
    expect(checkbox).toBeChecked();
    expect(radio1).toBeChecked();
    expect(radio2).not.toBeChecked();
    expect(select.value).toEqual("option-1");
    expect(option1.selected).toBeTruthy();
    expect(option2.selected).toBeFalsy();
    expect(option3.selected).toBeFalsy();

    // click on button to clear all fields
    fireEvent.click(button);

    // validate input values
    expect(input).toHaveValue("");
    expect(number).toHaveValue(null);
    expect(checkbox).not.toBeChecked();
    expect(radio1).not.toBeChecked();
    expect(radio2).not.toBeChecked();
    expect(select.value).toEqual("");
    expect(option1.selected).toBeFalsy();
    expect(option2.selected).toBeFalsy();
    expect(option3.selected).toBeFalsy();
  });

  it("clearField (with fieldName) clears field", () => {
    const InputComp = () => {
      const form = useForm("test", {
        defaultValues: {
          "dummy-input": "test",
          "dummy-number": 69,
        },
      });

      useEffect(() => {
        expect(form.getValues()).toEqual({
          ["dummy-input"]: "test",
          ["dummy-number"]: 69,
          ["dummy-checkbox"]: false,
          ["dummy-radio.opt1"]: false,
          ["dummy-radio.opt2"]: false,
          ["dummy-select"]: "option-1",
        });
      }, [form]);

      return (
        <>
          <button
            data-testid="button"
            onClick={() => form.clearField("dummy-input")}
          >
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
          <select data-testid="select" {...form.register("dummy-select")}>
            <option data-testid="select-option-1" value="option-1">
              option 1
            </option>
            <option data-testid="select-option-2" value="option-2">
              option 2
            </option>
            <option data-testid="select-option-3" value="option-3">
              option 3
            </option>
          </select>
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

    const select = getByTestId<HTMLSelectElement>(container, "select");
    if (!select) throw Error("input not found");

    const option1 = getByTestId<HTMLOptionElement>(
      container,
      "select-option-1",
    );
    if (!option1) throw Error("option not found");

    const option2 = getByTestId<HTMLOptionElement>(
      container,
      "select-option-2",
    );
    if (!option2) throw Error("option not found");

    const option3 = getByTestId<HTMLOptionElement>(
      container,
      "select-option-3",
    );
    if (!option3) throw Error("option not found");

    const button = getByTestId(container, "button");
    if (!button) throw Error("button not found");

    // default value should be present on all inputs
    expect(input).toHaveValue("test");
    expect(number).toHaveValue(69);
    expect(checkbox).not.toBeChecked();
    expect(radio1).not.toBeChecked();
    expect(radio2).not.toBeChecked();
    expect(select.value).toEqual("option-1");
    expect(option1.selected).toBeTruthy();
    expect(option2.selected).toBeFalsy();
    expect(option3.selected).toBeFalsy();

    // click on button to clear dummy-input
    fireEvent.click(button);

    // validate only dummy-input gets its value cleared
    expect(input).toHaveValue("");

    expect(number).toHaveValue(69);
    expect(checkbox).not.toBeChecked();
    expect(radio1).not.toBeChecked();
    expect(radio2).not.toBeChecked();
    expect(select.value).toEqual("option-1");
    expect(option1.selected).toBeTruthy();
    expect(option2.selected).toBeFalsy();
    expect(option3.selected).toBeFalsy();
  });

  it("clearField does nothing if input does not exist", () => {
    const InputComp = () => {
      const form = useForm("test", {
        defaultValues: {
          "dummy-input": "test",
          "dummy-number": 69,
        },
      });

      useEffect(() => {
        expect(form.getValues()).toEqual({
          ["dummy-input"]: "test",
          ["dummy-number"]: 69,
          ["dummy-checkbox"]: false,
          ["dummy-radio.opt1"]: false,
          ["dummy-radio.opt2"]: false,
          ["dummy-select"]: "option-1",
        });
      }, [form]);

      return (
        <>
          <button
            data-testid="button"
            onClick={() => form.clearField("who-cares")}
          >
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
          <select data-testid="select" {...form.register("dummy-select")}>
            <option data-testid="select-option-1" value="option-1">
              option 1
            </option>
            <option data-testid="select-option-2" value="option-2">
              option 2
            </option>
            <option data-testid="select-option-3" value="option-3">
              option 3
            </option>
          </select>
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

    const select = getByTestId<HTMLSelectElement>(container, "select");
    if (!select) throw Error("input not found");

    const option1 = getByTestId<HTMLOptionElement>(
      container,
      "select-option-1",
    );
    if (!option1) throw Error("option not found");

    const option2 = getByTestId<HTMLOptionElement>(
      container,
      "select-option-2",
    );
    if (!option2) throw Error("option not found");

    const option3 = getByTestId<HTMLOptionElement>(
      container,
      "select-option-3",
    );
    if (!option3) throw Error("option not found");

    const button = getByTestId(container, "button");
    if (!button) throw Error("button not found");

    // default value should be present on all inputs
    expect(input).toHaveValue("test");
    expect(number).toHaveValue(69);
    expect(checkbox).not.toBeChecked();
    expect(radio1).not.toBeChecked();
    expect(radio2).not.toBeChecked();
    expect(select.value).toEqual("option-1");
    expect(option1.selected).toBeTruthy();
    expect(option2.selected).toBeFalsy();
    expect(option3.selected).toBeFalsy();

    // click on button to clear non-existing field
    fireEvent.click(button);

    // validate that all inputs remain unchanged
    expect(input).toHaveValue("test");
    expect(number).toHaveValue(69);
    expect(checkbox).not.toBeChecked();
    expect(radio1).not.toBeChecked();
    expect(radio2).not.toBeChecked();
    expect(select.value).toEqual("option-1");
    expect(option1.selected).toBeTruthy();
    expect(option2.selected).toBeFalsy();
    expect(option3.selected).toBeFalsy();
  });
});
