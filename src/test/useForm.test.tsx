import { useEffect, useRef, useState } from "react";
import { useForm } from "../form";
import { render } from "@testing-library/react";
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
});
