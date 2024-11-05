import { Spy } from "@dffrs/spy";
import { GroupReg, Register, SimpleReg } from "./types";

class Value<V> {
  value: V | undefined;
  constructor() {
    this.value = undefined; // NOTE: init value
  }

  getValue() {
    return this.value;
  }

  setValue(newValue: V | undefined) {
    this.value = newValue;
  }
}

const SValue = Spy(Value);
const dummy = new (Spy(Value))();
type A = typeof dummy;

export class Internal {
  registor: Record<string, HTMLInputElement>;
  defaultValues: Record<string, unknown>;
  values: Record<string, A>;

  private static readonly DELIMITER = ".";

  constructor() {
    this.registor = {};
    this.defaultValues = {};
    this.values = {};
  }

  getDelimiter() {
    return Internal.DELIMITER;
  }

  encodeFieldName(groupReg: GroupReg): SimpleReg {
    return `${groupReg["groupName"]}${Internal.DELIMITER}${groupReg["element"]}`;
  }

  decodeFieldName(encodedFieldName: SimpleReg): GroupReg {
    const [groupName, element] = encodedFieldName.split(Internal.DELIMITER);
    return { groupName, element };
  }

  simplifyFieldName(fieldName: Register) {
    return typeof fieldName === "string"
      ? fieldName
      : this.encodeFieldName(fieldName);
  }

  isFieldRegistred(fieldName: Register) {
    return this.simplifyFieldName(fieldName) in this.registor;
  }

  getValueFromInput<V extends HTMLInputElement>(input: V) {
    const ref = input;

    switch (ref.type) {
      case "file":
        return ref.files;
      case "radio":
      case "checkbox":
        return ref.checked;

      case "number":
        if (ref.value === "") return undefined;
        return +ref.value; // NOTE: might return NaN

      default:
        return ref.value;
    }
  }

  registerField<V extends HTMLInputElement>(_fieldName: Register, ref: V) {
    const fieldName = this.simplifyFieldName(_fieldName);

    if (this.isFieldRegistred(fieldName)) return this.registor[fieldName];

    this.registor[fieldName] = ref;
    return ref;
  }

  unregisterField(fieldName: string) {
    if (!this.isFieldRegistred(fieldName)) return false;

    delete this.registor[fieldName];
    return true;
  }

  getValueFor(_fieldName: Register) {
    const fieldName = this.simplifyFieldName(_fieldName);

    const ref = this.registor[fieldName];

    return this.getValueFromInput(ref);
  }

  getValues() {
    return Object.keys(this.registor).reduce<Record<string, unknown>>(
      (prev, key) => {
        let value = this.getValueFor(key);

        prev[key] = value;

        return prev;
      },
      {},
    );
  }

  getDefaultValueFor(_fieldName: Register) {
    const fieldName = this.simplifyFieldName(_fieldName);

    return this.defaultValues[fieldName];
  }

  getDefaultValues() {
    return Object.keys(this.registor).reduce<Record<string, unknown>>(
      (prev, curr) => {
        prev[curr] = this.getDefaultValueFor(curr);

        return prev;
      },
      {},
    );
  }

  initValueFor<V extends HTMLInputElement>(_fieldName: Register, input: V) {
    const fieldName = this.simplifyFieldName(_fieldName);

    let v: A;
    if (fieldName in this.values) v = this.values[fieldName];
    else v = new SValue();

    v.setValue(this.getValueFromInput(input));

    this.values[fieldName] = v;
  }

  initValues(values: Record<string, unknown>) {
    Object.entries(values).forEach(([key, defValue]) => {
      const v = new SValue<typeof defValue>();
      v.setValue(defValue);

      this.values[key] = v;
    });
  }

  setValueFor(_fieldName: Register, value: unknown) {
    const fieldName = this.simplifyFieldName(_fieldName);

    if (!(fieldName in this.registor)) {
      console.error(
        `[Error-setValueFor]: Not possible to set value for ${_fieldName}. It must be registered first`,
      );
      return;
    }

    const inpRef = this.registor[fieldName];

    let v: A;
    if (fieldName in this.values) v = this.values[fieldName];
    else v = new SValue();

    v.setValue(value);

    // NOTE: IT ONLY WORKS FOR CHECKBOX (SO FAR)
    inpRef.checked = value as boolean; // TODO: create method to inject form's internal values with input's values
  }
}
