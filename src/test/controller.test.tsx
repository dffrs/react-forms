import { expect } from "vitest";
import { Controller, FormProvider, useForm } from "../form";
import { fireEvent, render } from "@testing-library/react";
import { useEffect } from "react";

describe("Controller tests", () => {
  it("Form values are correct", () => {
    const fieldName = "i-text";
    const expected = "this is a test";

    const Comp = () => {
      const form = useForm("test");

      useEffect(() => {
        expect(form.getValues()).to.deep.equal({
          "i-text": "",
        });
      }, []);

      return (
        <>
          <Controller fieldName={fieldName} form={form}>
            {({ ref }) => <input data-testid="input" type="text" ref={ref} />}
          </Controller>
          <button
            data-testid="button"
            onClick={() => {
              expect(form.getValueFor(fieldName)).to.equal(expected);
            }}
          >
            Click me
          </button>
        </>
      );
    };

    const { getByTestId } = render(<Comp />);

    const input = getByTestId("input");
    if (!input) throw Error("input not found");

    const button = getByTestId("button");
    if (!button) throw Error("button not found");

    fireEvent.change(input, { target: { value: expected } });
    fireEvent.click(button);
  });

  it("Value prop is reactive", () => {
    const fieldName = "i-text";
    const expected = "this is a test";

    const Comp = () => {
      const form = useForm("test");

      useEffect(() => {
        expect(form.getValues()).to.deep.equal({
          "i-text": "",
        });
      }, []);

      return (
        <FormProvider form={form}>
          <Controller fieldName={fieldName}>
            {({ ref, value }) => (
              <>
                <input data-testid="input" type="text" ref={ref} />
                {/* @ts-expect-error ignore*/}
                <span data-testid="span">{value}</span>
              </>
            )}
          </Controller>
          <button
            data-testid="button"
            onClick={() => {
              expect(form.getValueFor(fieldName)).to.equal(expected);
            }}
          >
            Click me
          </button>
        </FormProvider>
      );
    };

    const { getByTestId } = render(<Comp />);

    const input = getByTestId("input");
    if (!input) throw Error("input not found");

    const button = getByTestId("button");
    if (!button) throw Error("button not found");

    const span = getByTestId("span");
    if (!span) throw Error("span not found");

    fireEvent.change(input, { target: { value: expected } });
    fireEvent.click(button);

    expect(span).toHaveTextContent(expected);
  });
});
