import { fireEvent, render } from "@testing-library/react";
import { useForm } from "../form";

describe("unregister tests", () => {
  it("calling form.unregister deletes ref, values & default values", () => {
    const Comp = () => {
      const form = useForm("test", {
        defaultValues: {
          input: "test",
          number: 12,
        },
      });

      return (
        <>
          <input type="text" {...form.register("input")} />
          <input type="number" {...form.register("number")} />
          <button
            data-testid="button"
            onClick={() => {
              expect(form.getValues()).toEqual({ input: "test", number: 12 });
              expect(form.getDefaultValues()).toEqual({
                input: "test",
                number: 12,
              });

              const hasUnregistered = form.unregisterField("input");
              expect(hasUnregistered).toBeTruthy();
              expect(form.unregisterField("non-existing-field")).toBeFalsy();

              expect(form.getValues()).toEqual({ number: 12 });
              expect(form.getValueFor("input")).toEqual(undefined);

              expect(form.getDefaultValues()).toEqual({
                number: 12,
              });
              expect(form.getDefaultValuesFor("input")).toEqual(undefined);
            }}
          >
            test
          </button>
        </>
      );
    };

    const { getByTestId } = render(<Comp />);

    const button = getByTestId("button");

    fireEvent.click(button);
  });
});
