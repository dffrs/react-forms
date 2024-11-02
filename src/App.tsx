import { useForm } from "./form";

function App() {
  const form = useForm("inputs", {
    defaultValues: { "i-checkbox": true, "i-text": "this is a text input" },
  });

  return (
    <>
      <h1>Inputs</h1>
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
          <input type="text" id="textId" {...form.register("i-text")} />
        </div>
        <div>
          <h3>Checkbox</h3>
          <input
            type="checkbox"
            id="checkboxId"
            {...form.register("i-checkbox")}
          />
          <label htmlFor="checkboxId">Test</label>
        </div>
      </div>
    </>
  );
}

export default App;
