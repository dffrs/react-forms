import { fireEvent, render, screen } from "@testing-library/react";
import { deepEqual, FormProvider, useWatchValue } from "../form";
import { useForm } from "../form/hooks/useForm";

describe("Form Test: useWatchValue", () => {
  it("listens to value change (inherits from default values)", () => {
    const InputComp = () => {
      const form = useForm("test-form", {
        defaultValues: {
          "text-input": "value from defaultValue",
          "select-input": "option2",
          "multi-select-input": ["option1", "option3"],
        },
      });

      const inputValue = useWatchValue("text-input", { form });
      const selectValue = useWatchValue("select-input", { form });
      const multiSelectValue = useWatchValue("multi-select-input", {
        form,
        compareFn: deepEqual,
      });

      return (
        <>
          <input
            data-testid="input"
            type="text"
            {...form.register("text-input")}
          />
          <select data-testid="select" {...form.register("select-input")}>
            <option data-testid="option1">option1</option>
            <option data-testid="option2">option2</option>
            <option data-testid="option3">option3</option>
          </select>
          <select
            data-testid="multi-select"
            multiple
            {...form.register("multi-select-input")}
          >
            <option data-testid="multi-option1">option1</option>
            <option data-testid="multi-option2">option2</option>
            <option data-testid="multi-option3">option3</option>
          </select>
          {/* @ts-expect-error  value is unknow (for now, might improve in the future)*/}
          <span data-testid="span">{inputValue}</span>

          {/* @ts-expect-error  value is unknow (for now, might improve in the future)*/}
          <span data-testid="select-span">{selectValue}</span>

          <span data-testid="multi-select-span">
            {String(multiSelectValue)}
          </span>
          <button
            data-testid="button"
            onClick={() => {
              form.setValueFor("text-input", "change with set value");
              form.setValueFor("select-input", "option3");
              form.setValueFor("multi-select-input", ["option2"]);
            }}
          >
            click
          </button>
        </>
      );
    };

    render(<InputComp />);
    const button = screen.getByTestId("button");
    const span = screen.getByTestId("span");
    const selectSpan = screen.getByTestId("select-span");
    const multiSelectSpan = screen.getByTestId("multi-select-span");

    expect(span).toHaveTextContent("value from defaultValue");
    expect(selectSpan).toHaveTextContent("option2");
    expect(multiSelectSpan).toHaveTextContent("option1,option3");

    fireEvent.click(button);

    expect(span).toHaveTextContent("change with set value");
    expect(selectSpan).toHaveTextContent("option3");
    expect(multiSelectSpan).toHaveTextContent("option2");
  });

  it("listens to value change (no default value)", () => {
    const InputComp = () => {
      const form = useForm("test-form");

      const inputValue = useWatchValue("text-input", { form });
      const selectValue = useWatchValue("select-input", { form });

      if (inputValue instanceof FileList) throw Error();
      if (selectValue instanceof FileList) throw Error();

      return (
        <>
          <input
            data-testid="input"
            type="text"
            {...form.register("text-input")}
          />
          <select data-testid="select" {...form.register("select-input")}>
            <option data-testid="option1">option1</option>
            <option data-testid="option2">option2</option>
            <option data-testid="option3">option3</option>
          </select>
          {/* @ts-expect-error  value is unknow (for now, might improve in the future)*/}
          <span data-testid="span">{inputValue}</span>
          {/* @ts-expect-error  value is unknow (for now, might improve in the future)*/}
          <span data-testid="select-span">{selectValue}</span>
          <button
            data-testid="button"
            onClick={() => {
              form.setValueFor("text-input", "change with set value");
              form.setValueFor("select-input", "option2");
            }}
          >
            click
          </button>
        </>
      );
    };

    render(<InputComp />);
    const button = screen.getByTestId("button");
    const span = screen.getByTestId("span");
    const selectSpan = screen.getByTestId("select-span");

    expect(span).toHaveTextContent("");
    expect(selectSpan).toHaveTextContent("option1");

    fireEvent.click(button);

    expect(span).toHaveTextContent("change with set value");
    expect(selectSpan).toHaveTextContent("option2");
  });

  it("listens to value change (no default value BUT there's a value on the field)", () => {
    const InputComp = () => {
      const form = useForm("test-form");

      const value = useWatchValue("text-input", { form });
      const selectValue = useWatchValue("select-input", { form });

      if (value instanceof FileList) throw Error();
      if (selectValue instanceof FileList) throw Error();

      return (
        <>
          <input
            data-testid="input"
            type="text"
            defaultValue="test"
            {...form.register("text-input")}
          />
          <select
            data-testid="select"
            defaultValue="option3"
            {...form.register("select-input")}
          >
            <option data-testid="option1">option1</option>
            <option data-testid="option2">option2</option>
            <option data-testid="option3">option3</option>
          </select>
          {/* @ts-expect-error  value is unknow (for now, might improve in the future)*/}
          <span data-testid="span">{value}</span>
          {/* @ts-expect-error  value is unknow (for now, might improve in the future)*/}
          <span data-testid="select-span">{selectValue}</span>
          <button
            data-testid="button"
            onClick={() => {
              form.setValueFor("text-input", "change with set value");
              form.setValueFor("select-input", "option2");
            }}
          >
            click
          </button>
        </>
      );
    };

    render(<InputComp />);
    const button = screen.getByTestId("button");
    const span = screen.getByTestId("span");
    const selectSpan = screen.getByTestId("select-span");

    expect(span).toHaveTextContent("test");
    expect(selectSpan).toHaveTextContent("option3");

    fireEvent.click(button);

    expect(span).toHaveTextContent("change with set value");
    expect(selectSpan).toHaveTextContent("option2");
  });

  it("works with FormProvider", () => {
    const WatchComp = () => {
      const value = useWatchValue("text-input");
      const selectValue = useWatchValue("select-input");

      if (value instanceof FileList) throw Error();
      if (selectValue instanceof FileList) throw Error();

      return (
        <>
          {/* @ts-expect-error fix this eventually*/}
          <span data-testid="span">{value}</span>
          {/* @ts-expect-error fix this eventually*/}
          <span data-testid="select-span">{selectValue}</span>
        </>
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
          <select data-testid="select" {...form.register("select-input")}>
            <option data-testid="option1">option1</option>
            <option data-testid="option2">option2</option>
            <option data-testid="option3">option3</option>
          </select>
          <button
            data-testid="button"
            onClick={() => {
              form.setValueFor("text-input", "change with set value");
              form.setValueFor("select-input", "option3");
            }}
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
    const selectSpan = screen.getByTestId("select-span");

    expect(span).toHaveTextContent("test");
    expect(selectSpan).toHaveTextContent("option1");

    fireEvent.click(button);

    expect(span).toHaveTextContent("change with set value");
    expect(selectSpan).toHaveTextContent("option3");
  });
});
