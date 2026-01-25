import { Spy } from "@dffrs/spy";
import { Internal } from "./internal";
import { CustomSelect, FormRefs, Register } from "./types";
import { ChangeEvent } from "react";

const SpyInternal = Spy(Internal);

export type Options = {
  defaultValues?: Record<string, unknown>;
  autoInject?: boolean;
};

export class Form {
  private name: string;
  internalState: InstanceType<typeof SpyInternal>;
  private autoInject: boolean | undefined;

  constructor(name: string, opt?: Options) {
    this.name = name;
    this.internalState = new SpyInternal();

    if (opt?.defaultValues) {
      const flattenDefValues = this.flattenObject(opt?.defaultValues);
      this.internalState.defaultValues = flattenDefValues;
      this.internalState.copyDefValues(flattenDefValues);
    }

    this.autoInject = opt?.autoInject;
  }

  private flattenObject(obj: Record<string, any>): Record<string, unknown> {
    const resultObj: Record<string, unknown> = {};

    const encode = this.internalState.encodeFieldName;

    for (const i in obj) {
      if (
        typeof obj[i] === "object" &&
        !Array.isArray(obj[i]) &&
        !(obj[i] instanceof File || obj[i] instanceof FileList)
      ) {
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

  private injectDefaultValues<V extends FormRefs>(
    fieldName: Register,
    inpRef: V,
  ) {
    const defaultValue = this.internalState.isFieldRegistred(fieldName)
      ? this.internalState.getValueFor(fieldName)
      : this.internalState.getDefaultValueFor(fieldName);

    // NOTE: undefined is the only value that can NOT be injected into inputs. What's the point, if nothing changes ?
    if (defaultValue !== undefined) {
      switch (inpRef.type) {
        case "file": {
          if (!(inpRef instanceof HTMLInputElement))
            throw Error(
              `[Error-injectDefaultValues]: inputRef is not an instance of HTMLInputElement`,
            );

          if (
            !(defaultValue instanceof FileList || defaultValue instanceof File)
          ) {
            console.error(
              `[Error-injectDefaultValues]: default value for file inputs must be an instance of File | FileList`,
              typeof defaultValue,
              defaultValue,
            );
            break;
          }

          const files = this.internalState.dealWithFiles(defaultValue);
          if (!files) break;

          inpRef.files = files;
          break;
        }
        case "radio":
        case "checkbox":
          if (!(inpRef instanceof HTMLInputElement))
            throw Error(
              `[Error-injectDefaultValues]: inputRef is not an instance of HTMLInputElement`,
            );

          inpRef.defaultChecked = !!defaultValue;
          break;
        case "select-one": {
          const selectDefaulValue = Array.isArray(defaultValue)
            ? defaultValue[0]
            : String(defaultValue);

          // NOTE: if we ONLY inject 'defaultValue', 'value' would NOT be in-sync (would have the first select's option as 'value')
          // Solution ? Assign 'selectDefaulValue' to it
          inpRef.defaultValue = selectDefaulValue;
          inpRef.value = selectDefaulValue;
          break;
        }
        case "select-multiple": {
          const ir = inpRef as CustomSelect;

          const selectDefaulValue = Array.isArray(defaultValue)
            ? defaultValue
            : String(defaultValue);

          // NOTE: multi-select 'value' is weird...
          // it always displays 1 option only, even if multiple are selected
          // soooo, no there's not point in doing 'ir.value = selectDefaulValue'
          //
          // selects are weird ...
          ir.defaultValue = selectDefaulValue;

          Array.from(ir.options).forEach((option) => {
            option.selected = selectDefaulValue?.includes(option.value);
          });

          break;
        }
        default:
          inpRef.defaultValue = defaultValue as string; // TODO: Fix type
          break;
      }
    }
  }

  getName() {
    return this.name;
  }

  register<V extends FormRefs>(
    fieldName: Register,
    opts?: { onChange?: (ev: ChangeEvent<V>) => void },
  ) {
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
        // NOTE: React calls ref with null on unmount or ref change
        // This means that we have an oportunity to clean up 'listener'
        // (it still has the same reference at this point)
        if (!input) {
          return null;
        }

        const inpRef = this.internalState.registerField(fieldName, input);

        const isAutoInjectDisabled = this.autoInject === false;
        const isFieldRegistred = this.internalState.isFieldRegistred(fieldName);

        if (isAutoInjectDisabled && isFieldRegistred) return null;

        // NOTE: Inject default value into field
        // if field has been registered before form's current value will be used
        // otherwise, default value, specified via form's register function, will be used instead
        this.injectDefaultValues(fieldName, inpRef);

        // NOTE: init values in form's `values` attribute.
        // Injects new values that were NOT specified on default values
        // Important to do this AFTER injecting default values (`values` will take those into consideration)
        this.internalState.initValueFor(fieldName, inpRef);

        return inpRef;
      },
      onChange: (ev: ChangeEvent<V>) => {
        const target = ev.currentTarget;

        // get value form field
        const value = this.internalState.getValueFromInput(target);
        // and update form values
        this.setValueFor(fieldName, value);

        const _onChange = opts?.onChange;

        if (_onChange) _onChange(ev);

        return true;
      },
    };
  }

  getInputRef(fieldName: Register) {
    if (!this.internalState.isFieldRegistred(fieldName)) return;
    const fn = this.internalState.simplifyFieldName(fieldName);

    return this.internalState.registor[fn];
  }

  clearField(fieldName: Register) {
    this.internalState.clearField(fieldName);
  }

  clearFields() {
    const registredFields = Object.keys(this.internalState.registor);

    registredFields.forEach((fieldName) => {
      this.clearField(fieldName);
    });
  }

  resetToDefaultValues(fieldName?: Register) {
    const dfv = this.internalState.defaultValues;

    // if fieldName was passed in, then reset only that field
    if (fieldName) {
      const fname = this.internalState.simplifyFieldName(fieldName);

      if (!(fname in dfv)) {
        console.error(
          "[Error-resetToDefaultValues]: fieldName is not present in default values",
          fname,
          dfv,
        );

        return;
      }

      const value = dfv[fname];
      this.setValueFor(fname, value);

      return;
    }

    // otherwise, reset them all
    Object.entries(dfv).forEach(([fieldName, value]) => {
      this.setValueFor(fieldName, value);
    });
  }

  getValueFor(fieldName: Register) {
    return this.internalState.getValueFor(fieldName);
  }

  getValues() {
    return this.internalState.getValues();
  }

  // TODO: What if I want to set a value for a groupReg
  // that is NOT a radio ?
  setValueFor(fieldName: Register, value: unknown) {
    // NOTE: fieldName could be passed in as 'radio.something'
    // instead of { groupName: 'radio', element: 'something'}
    const isSimpleReg =
      typeof fieldName === "string" &&
      !this.internalState.isGroupRegAsString(fieldName);

    if (isSimpleReg) {
      this.internalState.setValueFor(fieldName, value);
      return;
    }

    // NOTE: deal with radio inputs
    const keysOfFormValues = Object.keys(this.getValues());
    const groupName = this.internalState.getGroupName(fieldName);

    if (groupName == null) {
      throw Error("[Error-setValueFor]: groupName format not supported");
    }

    // reset radio input (every option is set to 'false')
    for (const key of keysOfFormValues) {
      if (!key.includes(groupName.groupName)) continue;
      if (this.getValueFor(key) !== true) continue;

      // only set the selected option to false
      this.internalState.setValueFor(key, false);
    }

    this.internalState.setValueFor(fieldName, value);
  }
}
