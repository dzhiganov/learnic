const isArrayUnique = <T>(arr: T[]): boolean =>
  Array.isArray(arr) && new Set(arr).size === arr.length;

export default isArrayUnique;
