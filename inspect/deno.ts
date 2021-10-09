const DEFAULT_INSPECT_OPTIONS = {
  depth: 4,
  indentLevel: 0,
  sorted: false,
  trailingComma: false,
  compact: true,
  iterableLimit: 100,
  showProxy: false,
  colors: false,
  getters: false,
  showHidden: false,
};

/**
 * @example
 * ```
 * // deno-lint-ignore no-explicit-any
 * (Float16Array.prototype as any)[Symbol.for("Deno.customInspect")] = customInspect;
 * ```
 * @todo Current custom inspector cannot access options. See [enhance custom inspect API proposal](https://github.com/denoland/deno/issues/8099)
 */
export function customInspect(inspect: typeof Deno.inspect): string {
  const array = [];
  for (let i = 0; i < this.length; ++i) {
    array[i] = this[i];
  }

  return `Float16Array(${this.length}) ${inspect(array, DEFAULT_INSPECT_OPTIONS)}`;
}
