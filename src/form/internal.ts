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

  isFieldRegistred(fieldName: string) {
    return fieldName in this.registor;
  }

  registerField<V extends HTMLInputElement>(_fieldName: Register, ref: V) {
    const fieldName =
      typeof _fieldName === "string"
        ? _fieldName
        : this.encodeFieldName(_fieldName);

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
    const fieldName =
      typeof _fieldName === "string"
        ? _fieldName
        : this.encodeFieldName(_fieldName);

    const ref = this.registor[fieldName];

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
    const fieldName =
      typeof _fieldName === "string"
        ? _fieldName
        : this.encodeFieldName(_fieldName);

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

  temp(key: string, newV: unknown) {}

  initValues(values: Record<string, unknown>) {
    Object.entries(values).forEach(([key, defValue]) => {
      const v = new SValue<typeof defValue>();
      v.setValue(defValue);

      this.values[key] = v;
    });
  }
}
