import { Form } from "../form";
import { render } from "@testing-library/react";

describe("Form tests", () => {
  it("registers field input type text", () => {
    const form = new Form("test");

    const InputComp = () => {
      const ref = form.register("dummy-input");
      return <input type="text" ref={ref} />;
    };

    render(<InputComp />);

    expect(form.getValues()).toEqual({ ["dummy-input"]: "" });
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
