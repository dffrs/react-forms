import { createRef } from "react";
import { Spy } from "@dffrs/spy";
import { Internal } from "./internal";

const SpyInternal = Spy(Internal);

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

  register<V extends HTMLInputElement>(fieldName: string) {
    const ref = createRef<V>();

    // TODO: Fix type
    const temp: any = {
      ref: this.internalState.registerField(fieldName, ref),
      name: fieldName,
    };

    const defaultValue = this.internalState.getDefaultValueFor(fieldName);
    if (defaultValue !== undefined) temp["defaultValue"] = defaultValue;

    return temp;
  }

  getValues() {
    return this.internalState.getValues();
  }
}
