import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { useForm, useWatchValue } from "../form";

describe("On input change", () => {
  it("input's change event triggers form to update its values (input text field)", () => {
    const InputComp = () => {
      const form = useForm("test-form", {
        defaultValues: {
          "text-input": "value from defaultValue",
        },
      });

      return (
        <>
          <input
            data-testid="input"
            type="text"
            {...form.register("text-input")}
          />
          <button
            data-testid="button"
            onClick={() =>
              expect(form.getValueFor("text-input")).toEqual(
                "this is the new text",
              )
            }
          >
            click
          </button>
        </>
      );
    };

    render(<InputComp />);
    const input = screen.getByTestId("input");
    const button = screen.getByTestId("button");

    expect(input).toHaveValue("value from defaultValue");

    fireEvent.change(input, { target: { value: "this is the new text" } });

    expect(input).toHaveValue("this is the new text");

    fireEvent.click(button);
  });

  it("input's input event triggers form to update its values (input checkbox field)", () => {
    const InputComp = () => {
      const form = useForm("test-form", {
        defaultValues: {
          "checkbox-input": true,
        },
      });

      return (
        <>
          <input
            data-testid="input"
            type="checkbox"
            {...form.register("checkbox-input")}
          />
          <button
            data-testid="button"
            onClick={() =>
              expect(form.getValueFor("checkbox-input")).toEqual(false)
            }
          >
            click
          </button>
        </>
      );
    };

    render(<InputComp />);
    const input = screen.getByTestId("input");
    const button = screen.getByTestId("button");

    expect(input).toBeChecked();

    fireEvent.click(input);

    expect(input).not.toBeChecked();

    fireEvent.click(button);
  });

  it("change handler is not duplicated on re-render", () => {
    const onChangeSpy = vi.fn();

    function Test() {
      const form = useForm("test");

      const value = useWatchValue("i-checkbox", { form });

      return (
        <>
          <input
            type="checkbox"
            {...form.register("i-checkbox")}
            onChange={onChangeSpy}
          />
          {/* @ts-expect-error test*/}
          <span>{value}</span>
        </>
      );
    }

    const { rerender, getByRole } = render(<Test />);

    const checkbox = getByRole("checkbox");
    const span = getByRole("span");

    fireEvent.click(checkbox);
    expect(onChangeSpy).toHaveBeenCalledTimes(1);
    expect(span).toHaveTextContent("true");

    rerender(<Test />);

    fireEvent.click(checkbox);
    expect(onChangeSpy).toHaveBeenCalledTimes(2); // NOT 3 or 4

    fireEvent.click(checkbox);
    expect(onChangeSpy).toHaveBeenCalledTimes(3); // NOT 3 or 4
  });
});
