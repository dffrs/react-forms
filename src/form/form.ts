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
      this.internalState.defaultValues = this.flattenObject(opt?.defaultValues);
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
    if (typeof fieldName === "string") {
      return {
        name: fieldName,
        ref: (input: V | null) => {
          if (!input) return;

          this.internalState.registerField(fieldName, input);

          const defaultValue = this.internalState.getDefaultValueFor(fieldName);

          // NOTE: undefined is the only value that can NOT be injected into inputs. What's the point, if nothing changes ?
          if (defaultValue !== undefined) {
            switch (input.type) {
              case "radio":
                input.defaultChecked = defaultValue as boolean;
                break;
              case "checkbox":
                input.defaultChecked = defaultValue as boolean;
                break;
              default:
                input.defaultValue = defaultValue as string; // TODO: Fix type
                break;
            }
          }
        },
      };
    }

    const { groupName, element } = fieldName;

    return {
      name: groupName,
      value: element,
      ref: (input: V | null) => {
        if (!input) return;

        this.internalState.registerField(fieldName, input);

        const defaultValue = this.internalState.getDefaultValueFor(fieldName);

        if (defaultValue !== undefined) {
          switch (input.type) {
            case "radio":
              input.defaultChecked = defaultValue as boolean;
              break;
            default:
              break;
          }
        }
      },
    };
  }

  getValues() {
    return this.internalState.getValues();
  }
}
