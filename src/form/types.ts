export type SimpleReg = string;
export type GroupReg = { groupName: string; element: string };
export type Register = SimpleReg | GroupReg;
export type CustomSelect = HTMLSelectElement & {
  defaultValue?: React.HTMLAttributes<HTMLSelectElement>["defaultValue"];
};
