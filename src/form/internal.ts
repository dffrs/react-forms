export class Internal {
  registor: Record<string, React.RefObject<HTMLInputElement>>;

  constructor() {
    this.registor = {};
  }

  isFieldRegistred(fieldName: string) {
    return fieldName in this.registor;
  }

  registerField<V extends HTMLInputElement>(
    fieldName: string,
    ref: React.RefObject<V>,
  ) {
    if (this.isFieldRegistred(fieldName)) return this.registor[fieldName];

    this.registor[fieldName] = ref;
    return ref;
  }

  unregisterField(fieldName: string) {
    if (!this.isFieldRegistred(fieldName)) return false;

    delete this.registor[fieldName];
    return true;
  }

  getValues() {
    return Object.entries(this.registor).reduce<
      Record<string, string | undefined>
    >((prev, [key, ref]) => {
      const _ref = ref.current;
      if (!_ref) return prev;

      prev[key] = _ref.value;

      return prev;
    }, {});
  }
}
