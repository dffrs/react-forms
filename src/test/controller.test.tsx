import { expect } from "vitest";
import { Controller, useForm } from "../form";
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
});
