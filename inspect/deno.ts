/**
 * @todo Current custom inspector cannot access options. See [enhance custom inspect API proposal](https://github.com/denoland/deno/issues/8099#issuecomment-757434256)
 * @example
 * ```
 * // deno-lint-ignore no-explicit-any
 * (Float16Array.prototype as any)[Symbol.for("Deno.customInspect")] = customInspect;
 * ```
 */
export function customInspect(inspect: typeof Deno.inspect): string {
  const length = this.length;

  const array = [];
  for (let i = 0; i < length; ++i) {
    array[i] = this[i];
  }

  return `Float16Array(${length}) ${inspect(array)}`;
}
