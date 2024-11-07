import { fireEvent, render, screen } from "@testing-library/react";
import { useWatchValue } from "../form";
import { useForm } from "../form/hooks/useForm";

describe("Form Test: useWatchValue", () => {
  it("listens to value change (inherits from default values)", () => {
    const InputComp = () => {
      const form = useForm("test-form", {
        defaultValues: {
          "text-input": "value from defaultValue",
        },
      });

      const value = useWatchValue("text-input", { form });

      if (value instanceof FileList) throw Error();

      return (
        <>
          <input
            data-testid="input"
            type="text"
            {...form.register("text-input")}
          />
          {/* @ts-expect-error */}
          <span data-testid="span">{value}</span>
          <button
            data-testid="button"
            onClick={() =>
              form.setValueFor("text-input", "change with set value")
            }
          >
            click
          </button>
        </>
      );
    };

    render(<InputComp />);
    const button = screen.getByTestId("button");
    const span = screen.getByTestId("span");

    expect(span).toHaveTextContent("value from defaultValue");

    fireEvent.click(button);

    expect(span).toHaveTextContent("change with set value");
  });

  it("listens to value change (no default value)", () => {
    const InputComp = () => {
      const form = useForm("test-form");

      const value = useWatchValue("text-input", { form });

      if (value instanceof FileList) throw Error();

      return (
        <>
          <input
            data-testid="input"
            type="text"
            {...form.register("text-input")}
          />
          {/* @ts-expect-error */}
          <span data-testid="span">{value}</span>
          <button
            data-testid="button"
            onClick={() =>
              form.setValueFor("text-input", "change with set value")
            }
          >
            click
          </button>
        </>
      );
    };

    render(<InputComp />);
    const button = screen.getByTestId("button");
    const span = screen.getByTestId("span");

    expect(span).toHaveTextContent("");

    fireEvent.click(button);

    expect(span).toHaveTextContent("change with set value");
  });
});
