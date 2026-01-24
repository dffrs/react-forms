import { useEffect, useState } from "react";
import { Controller, deepEqual, useForm, useWatchValue } from "./form";
const temp = ["option-3", "option-2"];

function App() {
  const [open, setOpen] = useState(() => true);

  const form = useForm("inputs", {
    defaultValues: {
      "i-checkbox": true,
      "i-text": "this is a text input",
      "i-file": new File(["who cares"], "filename", { type: "text/html" }),
      "i-radio": {
        phone: true,
      },
      "i-select": temp,
    },
  });

  const value = useWatchValue("i-select", { form, compareFn: deepEqual });

  useEffect(() => {
    console.log("value", value);
  }, [value]);

  return (
    <>
      <h1>Inputs</h1>
      <button type="button" onClick={() => console.log(form.getValues())}>
        log form values
      </button>

      <button
        type="button"
        onClick={() => console.log(form.internalState.values)}
      >
        internal values
      </button>

      <button
        type="button"
        onClick={() => form.setValueFor("i-checkbox", !value)}
      >
        toggle checkbox
      </button>
      <button type="button" onClick={() => setOpen((e) => !e)}>
        open/close
      </button>
      <button type="button" onClick={() => form.resetToDefaultValues()}>
        reset to default value
      </button>
      <button type="button" onClick={() => form.clearFields()}>
        clear fields
      </button>
      {open && (
        <div
          style={{
            display: "flex",
            justifyContent: "start",
            flexDirection: "column",
            gap: "10px",
            width: "100vw",
          }}
        >
          <div>
            <h3>Select</h3>
            <select multiple {...form.register("i-select")}>
              <option value="option-1">option 1</option>
              <option value="option-2">option 2</option>
              <option value="option-3">option 3</option>
            </select>
          </div>
          <div>
            <h3>Text</h3>
            <input
              type="text"
              id="textId"
              {...form.register("i-text", {
                onChange: () => console.log("change"),
              })}
              onInput={() => console.log("input")}
            />
          </div>
          <div>
            <h3>Checkbox</h3>
            <input
              type="checkbox"
              id="checkboxId"
              {...form.register("i-checkbox", {
                onChange: () => console.log("change"),
              })}
            />
            <label htmlFor="checkboxId">Test</label>
          </div>
          <div>
            <h3>Radio</h3>
            <input
              type="radio"
              id="contactChoice1"
              value="email"
              onInput={() => console.log("input")}
              {...form.register(
                { groupName: "i-radio", element: "email" },
                { onChange: () => console.log("change") },
              )}
            />
            <label htmlFor="contactChoice1">Email</label>
            <input
              type="radio"
              id="contactChoice2"
              value="phone"
              {...form.register({ groupName: "i-radio", element: "phone" })}
            />
            <label htmlFor="contactChoice2">Phone</label>
            <input
              type="radio"
              id="contactChoice3"
              value="mail"
              {...form.register({ groupName: "i-radio", element: "mail" })}
            />
            <label htmlFor="contactChoice3">Mail</label>
          </div>
          <div>
            <h3>File</h3>
            <input type="file" id="fileId" {...form.register("i-file")} />
            <label htmlFor="fileId">Test</label>
          </div>
          <div>
            <h3>Textarea</h3>
            <Controller fieldName="i-textarea" form={form}>
              {({ ref, value, onChange }) => (
                <>
                  <input type="text" ref={ref} onChange={onChange} />
                  <span>{value as string}</span>
                </>
              )}
            </Controller>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
