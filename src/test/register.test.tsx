import { Form } from "../form";
import { render } from "@testing-library/react";

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
        descr: "type file",
        type: "file",
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
        expected: "on",
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
        expected: "",
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
        expected: "on",
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
      const form = new Form("test");

      const InputComp = () => {
        const ref = form.register("dummy-input");
        return <input type={type} ref={ref} />;
      };

      render(<InputComp />);

      expect(form.getValues()).toEqual({ ["dummy-input"]: expected });
    });
  });

  it("respects inptus value", () => {
    const form = new Form("test");

    const InputComp = () => {
      const ref = form.register("dummy-input");
      return <input type="text" ref={ref} value="test" />;
    };

    render(<InputComp />);

    expect(form.getValues()).toEqual({ ["dummy-input"]: "test" });
  });
});
