import { fireEvent, render, screen } from "@testing-library/react";
import { FormProvider, useWatchValue } from "../form";
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
          {/* @ts-expect-error  value is unknow (for now, might improve in the future)*/}
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
          {/* @ts-expect-error  value is unknow (for now, might improve in the future)*/}
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

  it("listens to value change (no default value BUT there's a value on the field)", () => {
    const InputComp = () => {
      const form = useForm("test-form");

      const value = useWatchValue("text-input", { form });

      if (value instanceof FileList) throw Error();

      return (
        <>
          <input
            data-testid="input"
            type="text"
            defaultValue="test"
            {...form.register("text-input")}
          />
          {/* @ts-expect-error  value is unknow (for now, might improve in the future)*/}
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

    expect(span).toHaveTextContent("test");

    fireEvent.click(button);

    expect(span).toHaveTextContent("change with set value");
  });

  it("works with FormProvider", () => {
    const WatchComp = () => {
      const value = useWatchValue("text-input");

      if (value instanceof FileList) throw Error();

      return (
        /* @ts-expect-error  fix this eventually*/
        <span data-testid="span">{value}</span>
      );
    };

    const InputComp = () => {
      const form = useForm("test-form");

      return (
        <FormProvider form={form}>
          <input
            data-testid="input"
            type="text"
            value="test"
            {...form.register("text-input")}
          />
          <button
            data-testid="button"
            onClick={() =>
              form.setValueFor("text-input", "change with set value")
            }
          >
            click
          </button>
          <WatchComp></WatchComp>
        </FormProvider>
      );
    };

    render(<InputComp />);
    const button = screen.getByTestId("button");
    const span = screen.getByTestId("span");

    expect(span).toHaveTextContent("test");

    fireEvent.click(button);

    expect(span).toHaveTextContent("change with set value");
  });
});
