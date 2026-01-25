export const partialKeyRegex = (pattern: string) => {
  return new RegExp(
    "^" + pattern.replace(/\./g, "\\.").replace(/\*/g, "[^.]+") + "$",
  );
};
