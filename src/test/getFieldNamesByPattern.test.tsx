import { fireEvent, render } from "@testing-library/react";
import { useForm, partialKeyRegex } from "../form";

describe("getFieldNamesByPattern tests", () => {
  it("setValueFor & getValueFor with getFieldNamesByPattern", () => {
    // setup
    const newText = "changed value";
    const numberOfInputs = 5;
    const generateNestedFieldNames = (
      group: string,
      delimiter: string,
      element: string,
    ) => {
      return group + delimiter + crypto.randomUUID() + delimiter + element;
    };

    const Comp = () => {
      const form = useForm("test");

      const listOfInputs = Array.from({ length: numberOfInputs }, (_, i) => ({
        group: "test",
        element: "input-" + (i + 1),
      }));

      return (
        <>
          {listOfInputs.map(({ group, element }) => {
            return (
              <input
                type="text"
                data-testid="input"
                {...form.register(
                  generateNestedFieldNames(
                    group,
                    form.internalState.getDelimiter(),
                    element,
                  ),
                )}
              />
            );
          })}
          <button
            data-testid="button"
            onClick={() => {
              const keys_v1 = form.getFieldNamesByPattern(
                partialKeyRegex("test.*.input*"),
              );

              const keys_v2 = form.getFieldNamesByPattern(
                partialKeyRegex("*.*.input*"),
              );

              const keys_v3 = form.getFieldNamesByPattern(
                partialKeyRegex("*.*.*"),
              );

              const keys_v4 = form.getFieldNamesByPattern(
                partialKeyRegex("*.*.input-*"),
              );

              expect(keys_v1).toEqual(keys_v2);
              expect(keys_v1).toEqual(keys_v3);
              expect(keys_v1).toEqual(keys_v4);

              expect(keys_v1.length).toEqual(numberOfInputs);

              keys_v1.forEach((key) =>
                expect(form.getValueFor(key)).toEqual(""),
              );

              keys_v1.forEach((key) => form.setValueFor(key, newText));

              keys_v1.forEach((key) =>
                expect(form.getValueFor(key)).toEqual(newText),
              );
            }}
          >
            test
          </button>
        </>
      );
    };

    const { getAllByTestId, getByTestId } = render(<Comp />);

    const inputs = getAllByTestId("input") as HTMLInputElement[];
    const button = getByTestId("button");

    fireEvent.click(button);

    inputs.forEach((i) => expect(i.value).toEqual(newText));
  });
});
