import { useEffect, useRef, useState } from "react";
import { useForm } from "../form";
import { fireEvent, getByTestId, render } from "@testing-library/react";
import { InputType } from "./util";

describe("Form Tests: useForm", () => {
  it("should always have the same reference (internal state)", () => {
    const DummyComp = () => {
      const [_, setS] = useState(false);

      const form = useForm("dummy-form");

      expect(form).not.toBeFalsy();

      const initialFormRef = useRef(form);

      useEffect(() => {
        // Re-render by toggling the state
        setS((prev) => !prev);

        // Check that the form reference is still the same
        expect(form).toBe(initialFormRef.current);
      }, [form]);

      return null;
    };

    render(<DummyComp />);
  });

  it("should always have the same reference (Parent re-renders)", () => {
    const ChildComp = ({ form }: { form: any }) => {
      const internalRef = useRef(form);

      expect(form).toBe(internalRef.current);
      return null;
    };

    const DummyComp = () => {
      const [_, setS] = useState(false);

      const form = useForm("dummy-form");

      expect(form).not.toBeFalsy();

      useEffect(() => {
        // Re-render by toggling the state
        setS((prev) => !prev);
      }, []);

      return <ChildComp form={form}></ChildComp>;
    };

    render(<DummyComp />);
  });

  Object.entries({
    text: {
      defaulValue: "test",
      expected: "test",
    },
    checkbox: {
      defaulValue: true,
      cb: (cont) => {
        expect(cont).toBeChecked();
      },
    },
    range: {
      defaulValue: 12,
      expected: "12",
    },
    email: {
      defaulValue: "test@mail.com",
      expected: "test@mail.com",
    },
    tel: {
      defaulValue: "123123123",
      expected: "123123123",
    },
    number: {
      defaulValue: 69, // nice
      expected: 69,
    },
  } as Record<
    InputType,
    {
      defaulValue: unknown;
      expected?: any;
      cb?: (input: Element) => void;
    }
  >).forEach(([type, { defaulValue, expected, cb }]) => {
    it("default value is injected into " + type + " input", () => {
      const InputComp = () => {
        const form = useForm("test", {
          defaultValues: { "test-input": defaulValue },
        });

        useEffect(() => {
          expect(form.getValues()).toEqual({
            "test-input": expected ?? defaulValue,
          });
        }, [form]);

        return <input type={type} {...form.register("test-input")} />;
      };

      const { container } = render(<InputComp />);

      const element = container.querySelector('input[name="test-input"]');

      if (element == null) throw Error("input not found");

      if (cb) cb(element);
      else expect(element).toHaveValue(expected);
    });
  });

  it("default value for input type radio", () => {
    const RadioComp = () => {
      const form = useForm("radio-form", {
        defaultValues: {
          contact: {
            email: true,
          },
        },
      });

      useEffect(() => {
        expect(form.getValues()).toEqual({
          "contact.email": true,
          "contact.phone": false,
          "contact.mail": false,
        });
      }, [form]);

      return (
        <>
          <input
            type="radio"
            id="contactChoice1"
            value="email"
            {...form.register({ groupName: "contact", element: "email" })}
          />
          <label htmlFor="contactChoice1">Email</label>
          <input
            type="radio"
            id="contactChoice2"
            value="phone"
            {...form.register({ groupName: "contact", element: "phone" })}
          />
          <label htmlFor="contactChoice2">Phone</label>
          <input
            type="radio"
            id="contactChoice3"
            value="mail"
            {...form.register({ groupName: "contact", element: "mail" })}
          />
          <label htmlFor="contactChoice3">Mail</label>
        </>
      );
    };
    const { container } = render(<RadioComp />);

    expect(container.querySelector('input[value="email"]')).toBeChecked();
    expect(container.querySelector('input[value="phone"]')).not.toBeChecked();
    expect(container.querySelector('input[value="mail"]')).not.toBeChecked();
  });

  it("default value for select input", () => {
    const InputComp = () => {
      const form = useForm("test", {
        defaultValues: {
          "dummy-select": "option-3",
        },
      });

      useEffect(() => {
        expect(form.getValues()).toEqual({ ["dummy-select"]: "option-3" });
      }, [form]);

      return (
        <select data-testid="select" {...form.register("dummy-select")}>
          <option data-testid="select-option-1" value="option-1">
            option 1
          </option>
          <option data-testid="select-option-2" value="option-2">
            option 2
          </option>
          <option data-testid="select-option-3" value="option-3">
            option 3
          </option>
        </select>
      );
    };

    const { container } = render(<InputComp />);

    const select = getByTestId<HTMLSelectElement>(container, "select");
    if (!select) throw Error("input not found");

    const option1 = getByTestId<HTMLOptionElement>(
      container,
      "select-option-1",
    );
    if (!option1) throw Error("option not found");

    const option2 = getByTestId<HTMLOptionElement>(
      container,
      "select-option-2",
    );
    if (!option2) throw Error("option not found");

    const option3 = getByTestId<HTMLOptionElement>(
      container,
      "select-option-3",
    );
    if (!option3) throw Error("option not found");

    expect(select.value).toEqual("option-3");
    expect(option1.selected).toBeFalsy();
    expect(option2.selected).toBeFalsy();
    expect(option3.selected).toBeTruthy();
  });

  it("only one true value when clicking on radio fields", () => {
    const RadioComp = () => {
      const form = useForm("radio-form", {
        defaultValues: {
          contact: {
            email: true,
          },
        },
      });

      useEffect(() => {
        expect(form.getValues()).toEqual({
          "contact.email": true,
          "contact.phone": false,
          "contact.mail": false,
        });
      }, [form]);

      return (
        <>
          <input
            type="radio"
            id="contactChoice1"
            value="email"
            {...form.register({ groupName: "contact", element: "email" })}
          />
          <label htmlFor="contactChoice1">Email</label>
          <input
            type="radio"
            id="contactChoice2"
            value="phone"
            {...form.register({ groupName: "contact", element: "phone" })}
          />
          <label htmlFor="contactChoice2">Phone</label>
          <input
            type="radio"
            id="contactChoice3"
            value="mail"
            {...form.register({ groupName: "contact", element: "mail" })}
          />
          <label htmlFor="contactChoice3">Mail</label>
          <button
            data-testid="check"
            onClick={() => {
              expect(form.getValues()).toEqual({
                "contact.email": false,
                "contact.phone": true,
                "contact.mail": false,
              });
            }}
          >
            find me
          </button>
        </>
      );
    };
    const { container } = render(<RadioComp />);

    const radioPhone = container.querySelector('input[value="phone"]');
    if (radioPhone == null) throw Error("field not found");

    const btn = container.querySelector('[data-testid="check"]');
    if (btn == null) throw Error("button not found");

    fireEvent.click(radioPhone);
    fireEvent.click(btn);
  });

  it("auto-inject is disabled so inputs are rendered empty initially", () => {
    const DummyComp = () => {
      const form = useForm("radio-form", {
        autoInject: false,
        defaultValues: {
          "dummy-input": "default value",
        },
      });

      useEffect(() => {
        expect(form.getValues()).toEqual({
          "dummy-input": "default value",
        });
      }, [form]);

      return (
        <>
          <input
            type="text"
            data-testid="input"
            {...form.register("dummy-input")}
          />
          <button
            data-testid="button"
            onClick={() => form.resetToDefaultValues()}
          >
            click me
          </button>
        </>
      );
    };
    const { container } = render(<DummyComp />);

    const input = container.querySelector('input[type="text"]');
    if (input == null) throw Error("field not found");

    const btn = container.querySelector('[data-testid="button"]');
    if (btn == null) throw Error("button not found");

    // initially there's no value
    expect(input).toHaveValue("");

    // call resetToDefaultValues
    fireEvent.click(btn);

    expect(input).toHaveValue("default value");
  });

  it("setValueFor input radio when string is passed in", () => {
    const RadioComp = () => {
      const form = useForm("radio-form", {
        defaultValues: {
          contact: {
            phone: false,
            mail: false,
            email: true,
          },
        },
      });

      useEffect(() => {
        expect(form.getValues()).toEqual({
          "contact.email": true,
          "contact.phone": false,
          "contact.mail": false,
        });
      }, [form]);

      return (
        <>
          <input
            type="radio"
            id="contactChoice1"
            value="email"
            {...form.register({ groupName: "contact", element: "email" })}
          />
          <label htmlFor="contactChoice1">Email</label>
          <input
            type="radio"
            id="contactChoice2"
            value="phone"
            {...form.register({ groupName: "contact", element: "phone" })}
          />
          <label htmlFor="contactChoice2">Phone</label>
          <input
            type="radio"
            id="contactChoice3"
            value="mail"
            {...form.register({ groupName: "contact", element: "mail" })}
          />
          <label htmlFor="contactChoice3">Mail</label>
          <button
            data-testid="check-group-reg"
            onClick={() => {
              form.setValueFor(
                { groupName: "contact", element: "phone" },
                true,
              );

              expect(form.getValues()).toEqual({
                "contact.email": false,
                "contact.phone": true,
                "contact.mail": false,
              });
            }}
          >
            group reg
          </button>
          <button
            data-testid="check-string-reg"
            onClick={() => {
              form.setValueFor("contact.email", true);

              expect(form.getValues()).toEqual({
                "contact.email": true,
                "contact.phone": false,
                "contact.mail": false,
              });
            }}
          >
            string reg
          </button>
        </>
      );
    };
    const { container } = render(<RadioComp />);

    const radioPhone = container.querySelector('input[value="phone"]');
    if (radioPhone == null) throw Error("field not found");

    const radioMail = container.querySelector('input[value="mail"]');
    if (radioMail == null) throw Error("field not found");

    const btnGroup = container.querySelector('[data-testid="check-group-reg"]');
    if (btnGroup == null) throw Error("button not found");

    const btnString = container.querySelector(
      '[data-testid="check-string-reg"]',
    );
    if (btnString == null) throw Error("button not found");

    // verify that 'setValueFor' works fine with { groupName: <string>, element: <string>}
    fireEvent.click(radioPhone);
    fireEvent.click(btnGroup);

    // verify that 'setValueFor' works fine with 'groupName.element'
    fireEvent.click(radioMail);
    fireEvent.click(btnString);
  });
});
