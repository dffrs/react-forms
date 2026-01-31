import { render } from "@testing-library/react";
import { useForm, useWatchError } from "../form";

describe("useWatchError tests", () => {
  it("sets & listens to errors", () => {
    const InputComp = () => {
      const form = useForm("test-form", {
        defaultValues: {
          "text-input": "value from defaultValue",
        },
      });

      const error = useWatchError("text-input", { form });

      return (
        <>
          <input
            data-testid="input"
            type="text"
            {...form.register("text-input")}
          />
          <button
            onClick={() => {
              // inject error
              const hasError = form.setErrorFor("text-input", "invalid input");

              // validate that form has injected the error message
              expect(hasError).toBeTruthy();

              // check that form has error
              expect(form.getErrorFor("text-input")).toBe("invalid input");
              expect(form.internalState.errors["text-input"]).toBe(
                "invalid input",
              );
              expect(error).toBe("invalid input");

              // clear error
              const hasClearedValue = form.clearErrorFor("text-input");
              expect(hasClearedValue).toBeTruthy();

              expect(form.getErrorFor("text-input")).toBe(undefined);
              expect(form.internalState.errors["text-input"]).toBe(undefined);
              expect(error).toBe(undefined);

              // do the same thing but for an non-existing input
              const shouldNotHaveError = form.setErrorFor(
                "non-existing-input",
                "invalid input",
              );
              expect(shouldNotHaveError).toBeFalsy();

              expect(form.internalState.errors["non-existing-input"]).toBe(
                undefined,
              );
            }}
          >
            set error
          </button>
        </>
      );
    };

    render(<InputComp />);
  });
});
