import { Spy } from "@dffrs/spy";
import { GroupReg, Register, SimpleReg } from "./types";

class Value<V> {
  value: V | undefined;
  constructor() {
    this.value = undefined; // NOTE: init value
  }

  setValue(newValue: V | undefined) {
    this.value = newValue;
  }
}

const SValue = Spy(Value);

export class Internal {
  registor: Record<string, HTMLInputElement>;
  defaultValues: Record<string, unknown>;
  values: Record<string, InstanceType<typeof SValue>>;

  private static readonly DELIMITER = ".";

  constructor() {
    this.registor = {};
    this.defaultValues = {};
    this.values = {};
  }

  ///////////////////////////////////////////////////
  //                                               //
  //                   Helpers                     //
  //                                               //
  ///////////////////////////////////////////////////
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

  ///////////////////////////////////////////////////
  //                                               //
  //     Registering and unregistering fields      //
  //                                               //
  ///////////////////////////////////////////////////
  registerField<V extends HTMLInputElement>(_fieldName: Register, ref: V) {
    const fieldName = this.simplifyFieldName(_fieldName);

    // if (this.isFieldRegistred(fieldName)) return this.registor[fieldName];

    this.registor[fieldName] = ref;
    return ref;
  }

  unregisterField(fieldName: string) {
    if (!this.isFieldRegistred(fieldName)) return false;

    delete this.registor[fieldName];
    return true;
  }

  ///////////////////////////////////////////////////
  //                                               //
  //           Default values for fields           //
  //                                               //
  ///////////////////////////////////////////////////
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

  copyDefValues(defValues: Record<string, unknown>) {
    Object.entries(defValues).forEach(([key, defValue]) => {
      const v = new SValue<typeof defValue>();
      v.setValue(defValue);

      this.values[key] = v;
    });
  }

  ///////////////////////////////////////////////////
  //                                               //
  //             Get values from form              //
  //                                               //
  ///////////////////////////////////////////////////

  // NOTE: Creates  a new entry, on form's values, for a field.
  // This is usefull for fields that were NOT specified on default values
  initValueFor<V extends HTMLInputElement>(_fieldName: Register, input: V) {
    const fieldName = this.simplifyFieldName(_fieldName);

    let v;
    if (fieldName in this.values) v = this.values[fieldName];
    else v = new SValue();

    v.setValue(this.getValueFromInput(input));

    this.values[fieldName] = v;
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

  // TODO: This needs to get values FROM form, not inputs (they might not be available at the time)
  getValueFor(_fieldName: Register) {
    const fieldName = this.simplifyFieldName(_fieldName);

    // has it been registered ?
    if (!(fieldName in this.values)) {
      console.error(
        `[Error-getValuesFor]: ${fieldName} needs to be registered first`,
      );

      const v = new SValue();

      v.setValue(undefined);

      this.values[fieldName] = v;
    }

    return this.values[fieldName].value;
  }

  getValues() {
    return Object.keys(this.registor).reduce<Record<string, unknown>>(
      (prev, key) => {
        const value = this.getValueFor(key);

        prev[key] = value;

        return prev;
      },
      {},
    );
  }

  ///////////////////////////////////////////////////
  //                                               //
  //             Set values onto fields            //
  //                                               //
  ///////////////////////////////////////////////////
  setValueFor(_fieldName: Register, value: unknown) {
    const fieldName = this.simplifyFieldName(_fieldName);

    if (!(fieldName in this.registor)) {
      console.error(
        `[Error-setValueFor]: Not possible to set value for ${_fieldName}. It must be registered first`,
      );
      return;
    }

    const inpRef = this.registor[fieldName];

    let v;
    if (fieldName in this.values) v = this.values[fieldName];
    else v = new SValue();

    // NOTE: This injects values into form
    v.setValue(value);

    // NOTE: This injects values into inputs
    switch (inpRef.type) {
      case "file":
        if (!(value instanceof FileList)) {
          console.error(
            `[Error-serValueFor]: Injecting value (${value}) into field. Value must be Filelist or null.`,
          );
          break;
        }
        inpRef.files = value; // TODO: test me. Use forms to inject a new file
        break;

      case "radio":
      case "checkbox":
        if (typeof value !== "boolean") {
          console.error(
            `[Error-serValueFor]: Injecting value (${value}) into field. Value must be boolean.`,
          );
          break;
        }
        inpRef.checked = value;
        break;

      default:
        inpRef.value = `${value}`;
        break;
    }
  }
}
