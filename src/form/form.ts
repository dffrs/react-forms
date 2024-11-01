import { createRef } from "react";
import { Spy } from "@dffrs/spy";
import { Internal } from "./internal";

const SpyInternal = Spy(Internal);

export class Form {
  private name;
  internalState;

  constructor(name: string) {
    this.name = name;
    this.internalState = new SpyInternal();
  }

  getName() {
    return this.name;
  }

  register(fieldName: string) {
    const ref = createRef<HTMLInputElement>();

    return this.internalState.registerField(fieldName, ref);
  }

  getValues() {
    return this.internalState.getValues();
  }
}
