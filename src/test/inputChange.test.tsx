import { fireEvent, getByTestId, render, screen } from "@testing-library/react";
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

    // FIXME: need to call 'click' 3 times because there's a problem with default values for checkboxes
    // After fix, only 1 click should be needed
    fireEvent.click(input);
    fireEvent.click(input);
    fireEvent.click(input);

    expect(input).not.toBeChecked();

    fireEvent.click(button);
  });

  it("input handler is not duplicated on re-render", () => {
    const onInputSpy = vi.fn();

    function Test() {
      const form = useForm("test");

      /* @ts-expect-error variable not being used */
      const _ = useWatchValue("i-checkbox", { form });

      return (
        <>
          <input
            type="checkbox"
            {...form.register("i-checkbox")}
            onInput={onInputSpy}
          />
        </>
      );
    }

    const { rerender, getByRole } = render(<Test />);

    const checkbox = getByRole("checkbox");

    fireEvent.click(checkbox);
    expect(onInputSpy).toHaveBeenCalledTimes(1);

    rerender(<Test />);

    fireEvent.click(checkbox);
    expect(onInputSpy).toHaveBeenCalledTimes(2);

    fireEvent.click(checkbox);
    expect(onInputSpy).toHaveBeenCalledTimes(3);
  });
});
