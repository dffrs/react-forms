import { fireEvent, render } from "@testing-library/react";
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
            data-testid="set-error"
            onClick={() => {
              // initially form does not have errors
              expect(form.getErrors()).toEqual({
                "text-input": undefined,
              });

              // inject error
              const hasError = form.setErrorFor("text-input", "invalid input");

              // validate that form has injected the error message
              expect(hasError).toBeTruthy();

              // check that form has error
              expect(form.getErrorFor("text-input")).toBe("invalid input");
              expect(form.internalState.errors["text-input"].error).toBe(
                "invalid input",
              );
            }}
          >
            set error
          </button>
          <button
            data-testid="clear-error"
            onClick={() => {
              expect(form.getErrors()).toEqual({
                "text-input": "invalid input",
              });

              // clear error
              const hasClearedValue = form.clearErrorFor("text-input");
              expect(hasClearedValue).toBeTruthy();

              expect(form.getErrorFor("text-input")).toBe(undefined);
              expect(form.internalState.errors["text-input"].error).toBe(
                undefined,
              );
            }}
          >
            clear error
          </button>
          <button
            data-testid="set-nothing"
            onClick={() => {
              const shouldNotHaveError = form.setErrorFor(
                "non-existing-input",
                "invalid input",
              );
              expect(shouldNotHaveError).toBeFalsy();
              expect(form.internalState.errors["non-existing-input"]).toBe(
                undefined,
              );

              expect(form.getErrors()).toEqual({
                "text-input": undefined,
              });
            }}
          >
            clear error
          </button>
          <span data-testid="span">{error}</span>
        </>
      );
    };

    const { getByTestId } = render(<InputComp />);

    const btnSetError = getByTestId("set-error");
    const btnClearError = getByTestId("clear-error");
    const btnSetNothing = getByTestId("set-nothing");
    const span = getByTestId("span");

    // initially there's no error
    expect(span).toHaveTextContent("");

    // set error
    fireEvent.click(btnSetError);
    expect(span).toHaveTextContent("invalid input");

    // clear error
    fireEvent.click(btnClearError);
    expect(span).toHaveTextContent("");

    // try to set an error for a field that does not exist
    fireEvent.click(btnSetNothing);
    expect(span).toHaveTextContent("");
  });
});
