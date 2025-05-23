import { Spy } from "@dffrs/spy";
import { Internal } from "./internal";
import { Register } from "./types";

const SpyInternal = Spy(Internal);

// function AfterMethod(_: any, __: string, descriptor: PropertyDescriptor) {
//   const originalMethod = descriptor.value;
//
//   descriptor.value = function (...args: any[]) {
//     // Call the original method
//     const result = originalMethod.apply(this, args);
//
//     // Return the original result if you want to keep it unchanged
//     return result;
//   };
//
//   return descriptor;
// }

export type Options = {
  defaultValues: Record<string, unknown>;
};

export class Form {
  private name: string;
  internalState: InstanceType<typeof SpyInternal>;

  constructor(name: string, opt?: Options) {
    this.name = name;
    this.internalState = new SpyInternal();

    if (opt?.defaultValues) {
      const flattenDefValues = this.flattenObject(opt?.defaultValues);
      this.internalState.defaultValues = flattenDefValues;
      this.internalState.copyDefValues(flattenDefValues);
    }
  }

  private flattenObject(obj: Record<string, any>): Record<string, unknown> {
    const resultObj: Record<string, unknown> = {};

    const encode = this.internalState.encodeFieldName;

    for (const i in obj) {
      if (typeof obj[i] === "object" && !Array.isArray(obj[i])) {
        // Recursively invoking the funtion
        // until the object gets flatten
        const tempObj = this.flattenObject(obj[i]);
        for (const j in tempObj) {
          resultObj[encode({ groupName: i, element: j })] = tempObj[j];
        }
      } else {
        resultObj[i] = obj[i];
      }
    }
    return resultObj;
  }

  private injectDefaultValues<V extends HTMLInputElement>(
    fieldName: Register,
    inpRef: V,
  ) {
    const defaultValue = this.internalState.isFieldRegistred(fieldName)
      ? this.internalState.getValueFor(fieldName)
      : this.internalState.getDefaultValueFor(fieldName);

    // NOTE: undefined is the only value that can NOT be injected into inputs. What's the point, if nothing changes ?
    if (defaultValue !== undefined) {
      switch (inpRef.type) {
        case "file":
          console.error(
            `[Error-register]: default value for file inputs are not supported (YET)`,
          );
          break;
        case "radio":
        case "checkbox":
          inpRef.defaultChecked = !!defaultValue;
          break;
        default:
          inpRef.defaultValue = defaultValue as string; // TODO: Fix type
          break;
      }
    }
  }

  private listenToInputChanges(fieldName: Register) {
    return (ev: Event) => {
      const target = ev.target;

      if (!(target instanceof HTMLInputElement)) {
        console.error(
          "[Error-listenToInputChanges]: Only input elements can be registered",
        );
        return;
      }

      // get value from the input and update forms
      const value = this.internalState.getValueFromInput(target);
      this.setValueFor(fieldName, value);

      const nativeSetter = Object.getOwnPropertyDescriptor(
        Object.getPrototypeOf(target),
        "value",
      )?.set;

      if (nativeSetter) {
        nativeSetter.call(target, value);

        const ev = new Event("input", { bubbles: true });
        target.dispatchEvent(ev);
      }
    };
  }

  getName() {
    return this.name;
  }

  register<V extends HTMLInputElement>(fieldName: Register) {
    const props =
      typeof fieldName === "string"
        ? { name: fieldName }
        : {
            name: fieldName.groupName,
            value: fieldName.element,
          };

    return {
      ...props,
      ref: (input: V | null) => {
        if (!input) return;

        const inpRef = this.internalState.registerField(fieldName, input);

        // NOTE:
        // Inject default value into field
        // if field has been registered before, form's current value, for it, will be used
        // otherwise, default value, specified via form's register function, will be used instead
        this.injectDefaultValues(fieldName, inpRef);

        // NOTE: init values in form's `values` attribute.
        // Injects new values that were NOT specified on default values
        // Important to do this AFTER injecting default values (`values` will take those into consideration)
        this.internalState.initValueFor(fieldName, inpRef);

        const temp = this.listenToInputChanges(fieldName);

        inpRef.addEventListener("change", temp); // TODO: Need to remove event

        return inpRef;
      },
    };
  }

  getValueFor(fieldName: Register) {
    return this.internalState.getValueFor(fieldName);
  }

  getValues() {
    return this.internalState.getValues();
  }

  setValueFor(fieldName: Register, value: unknown) {
    // TODO: refactor this
    // fieldName could be passed in as 'radio.something' instead of { groupName: 'radio', element: 'something'}
    if (typeof fieldName === "string") {
      this.internalState.setValueFor(fieldName, value);
      return;
    }

    // NOTE:
    // For input radios, only 1 option can be 'true'
    // This function turns 'true' option to 'false' first (assuming that other option is selected),
    // and then sets 'value'
    // TODO: CLEAN THIS UP
    Object.keys(this.getValues())
      .filter((inputFieldNames) => {
        if (
          !inputFieldNames.includes(
            fieldName.groupName + this.internalState.getDelimiter(),
          )
        )
          return;
        if (this.getValueFor(inputFieldNames) !== true) return;

        return inputFieldNames;
      })
      .forEach((fieldsToReset) => {
        this.internalState.setValueFor(fieldsToReset, false);
      });

    this.internalState.setValueFor(fieldName, value);
  }
}
