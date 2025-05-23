import { useEffect, useState } from "react";
import { useForm } from "../form";
import {
  fireEvent,
  getByTestId,
  queryByTestId,
  render,
} from "@testing-library/react";

type InputType = React.HTMLInputTypeAttribute;
type Temp = { descr: string; type: InputType; expected: unknown };

describe("Form tests: Values", () => {
  (
    [
      {
        descr: "type text",
        type: "text",
        expected: "",
      },
      {
        descr: "type url",
        type: "url",
        expected: "",
      },
      {
        descr: "type date",
        type: "date",
        expected: "",
      },
      {
        descr: "type time",
        type: "time",
        expected: "",
      },
      {
        descr: "type week",
        type: "week",
        expected: "",
      },
      {
        descr: "type color",
        type: "color",
        expected: "#000000",
      },
      {
        descr: "type email",
        type: "email",
        expected: "",
      },
      {
        descr: "type image",
        type: "image",
        expected: "",
      },
      {
        descr: "type month",
        type: "month",
        expected: "",
      },
      {
        descr: "type radio",
        type: "radio",
        expected: false,
      },
      {
        descr: "type range",
        type: "range",
        expected: "50",
      },
      {
        descr: "type reset",
        type: "reset",
        expected: "",
      },
      {
        descr: "type number",
        type: "number",
        expected: undefined, // NOTE: if there's no value, it should return undefined, not 0
      },
      {
        descr: "type button",
        type: "button",
        expected: "",
      },
      {
        descr: "type hidden",
        type: "hidden",
        expected: "",
      },
      {
        descr: "type search",
        type: "search",
        expected: "",
      },
      {
        descr: "type hidden",
        type: "hidden",
        expected: "",
      },
      {
        descr: "type submit",
        type: "submit",
        expected: "",
      },
      {
        descr: "type checkbox",
        type: "checkbox",
        expected: false,
      },
      {
        descr: "type password",
        type: "password",
        expected: "",
      },
      {
        descr: "type datetime-local",
        type: "datetime-local",
        expected: "",
      },
    ] as Array<Temp>
  ).forEach(({ descr, type, expected }) => {
    it("registers field input " + descr, () => {
      const InputComp = () => {
        const form = useForm("test");

        useEffect(() => {
          expect(form.getValues()).toEqual({ ["dummy-input"]: expected });
        }, [form]);

        return <input type={type} {...form.register("dummy-input")} />;
      };

      render(<InputComp />);
    });
  });

  it("respects inputs value", () => {
    const InputComp = () => {
      const form = useForm("test");

      useEffect(() => {
        expect(form.getValues()).toEqual({ ["dummy-input"]: "test" });
      }, [form]);

      return (
        <input type="text" {...form.register("dummy-input")} value="test" />
      );
    };

    render(<InputComp />);
  });

  it("auto-injecting values after calling register for the second time", async () => {
    const InputComp = () => {
      const [visible, setVisible] = useState(() => true);
      const form = useForm("test", {
        defaultValues: { "dummy-input": "test" },
      });

      useEffect(() => {
        expect(form.getValues()).toEqual({ ["dummy-input"]: "test" });
      }, [form]);

      return (
        <>
          <button data-testid="button" onClick={() => setVisible((v) => !v)}>
            click me
          </button>
          {visible && (
            <input
              data-testid="input"
              type="text"
              {...form.register("dummy-input")}
            />
          )}
        </>
      );
    };

    const { container } = render(<InputComp />);

    const input = getByTestId(container, "input");
    if (!input) throw Error("input not found");

    const button = getByTestId(container, "button");
    if (!button) throw Error("button not found");

    // default value should be present on input
    expect(input).toHaveValue("test");

    // click on button to remove input from DOM
    fireEvent.click(button);
    expect(queryByTestId(container, "input")).toBeNull();

    // click again and validate that input gets rendered with default value
    fireEvent.click(button);
    expect(input).toHaveValue("test");

    // now lets do it again but changing the value to something else first
    fireEvent.change(input, { target: { value: "new value" } });

    expect(input).toHaveValue("new value");

    fireEvent.click(button);
    expect(queryByTestId(container, "input")).toBeNull();

    expect(input).toHaveValue("new value");
  });
});
