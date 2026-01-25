export const deepEqual = (a: any, b: any, visited = new WeakMap()): boolean => {
  if (a === b) {
    return true;
  }

  if (
    typeof a !== "object" ||
    a === null ||
    typeof b !== "object" ||
    b === null
  ) {
    return false;
  }

  if (visited.has(a) && visited.get(a) === b) {
    return true;
  }

  visited.set(a, b);
  visited.set(b, a);

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) {
    return false;
  }

  for (const key of keysA) {
    if (!keysB.includes(key) || !deepEqual(a[key], b[key], visited)) {
      return false;
    }
  }

  return true;
};

export const partialKeyRegex = (pattern: string) => {
  return new RegExp(
    "^" + pattern.replace(/\./g, "\\.").replace(/\*/g, "[^.]+") + "$",
  );
};
