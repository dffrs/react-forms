import { Spy } from "@dffrs/spy";
import { Internal } from "./internal";

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

    if (opt?.defaultValues)
      this.internalState.defaultValues = opt.defaultValues;
  }

  getName() {
    return this.name;
  }

  // @AfterMethod
  register<V extends HTMLInputElement>(fieldName: string) {
    return {
      name: fieldName,
      ref: (input: V | null) => {
        if (!input) return;

        this.internalState.registerField(fieldName, input);

        const defaultValue = this.internalState.getDefaultValueFor(fieldName);
        if (defaultValue) input.defaultValue = defaultValue as string; // TODO: Fix type
      },
    };
  }

  getValues() {
    return this.internalState.getValues();
  }
}
