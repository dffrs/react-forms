import { fireEvent, render, screen } from "@testing-library/react";
import { useForm } from "../form";

describe("On input change", () => {
  it("input's input event triggers form to update it's values (input text field)", () => {
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

    fireEvent.input(input, { target: { value: "this is the new text" } });

    expect(input).toHaveValue("this is the new text");

    fireEvent.click(button);
  });

  it("input's input event triggers form to update it's values (input checkbox field)", () => {
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
});
