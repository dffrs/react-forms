import { useEffect, useState } from "react";
import { useForm, useWatchValue } from "./form";

function App() {
  const [open, setOpen] = useState(() => true);

  const form = useForm("inputs", {
    defaultValues: {
      // "i-checkbox": true,
      "i-text": "this is a text input",
      "i-radio": {
        phone: true,
      },
    },
  });

  const value = useWatchValue("i-checkbox", { form });
  const file = useWatchValue("i-file", { form });

  useEffect(() => {
    console.log("value", value);
  }, [value]);

  useEffect(() => {
    console.log("value", file);
  }, [file]);

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
      <button type="button" onClick={() => form.injectValues()}>
        inject values
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
            <h3>Text</h3>
            <input
              type="text"
              id="textId"
              {...form.register("i-text")}
              onInput={() => console.log("input")}
              onChange={() => console.log("change")}
            />
          </div>
          <div>
            <h3>Checkbox</h3>
            <input
              type="checkbox"
              id="checkboxId"
              {...form.register("i-checkbox")}
              onInput={() => console.log("input")}
              onChange={() => console.log("change")}
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
              onChange={() => console.log("change")}
              {...form.register({ groupName: "i-radio", element: "email" })}
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
        </div>
      )}
    </>
  );
}

export default App;
