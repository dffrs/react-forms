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
  private name;
  internalState;

  constructor(name: string, opt?: Options) {
    this.name = name;
    this.internalState = new SpyInternal();

    if (opt?.defaultValues) {
      const flattenDefValues = this.flattenObject(opt?.defaultValues);
      this.internalState.defaultValues = flattenDefValues;
      this.internalState.initValues(flattenDefValues);
    }
  }

  private flattenObject(obj: Record<string, any>): Record<string, unknown> {
    let resultObj: Record<string, unknown> = {};

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

        // NOTE: Field must be register ONLY once.
        if (this.internalState.isFieldRegistred(fieldName)) return;

        const inpRef = this.internalState.registerField(fieldName, input);

        const defaultValue = this.internalState.getDefaultValueFor(fieldName);

        // NOTE: undefined is the only value that can NOT be injected into inputs. What's the point, if nothing changes ?
        if (defaultValue !== undefined) {
          switch (inpRef.type) {
            case "file":
              console.error(
                `[Error-register]: default value for file inputs are not supported`,
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

        // NOTE: init value in form's `values` attribute. Important to do this AFTER injecting default values (`values` will take those into consideration)
        this.internalState.initValueFor(fieldName, inpRef);

        // const a = (args: any) => console.log(args);

        // input.addEventListener("input", a);

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
}
