import type { Float16Array } from "../index.d.ts";

/**
 * Custom inspect function for Deno
 *
 * ```
 * // deno-lint-ignore no-explicit-any
 * (Float16Array.prototype as any)[Symbol.for("Deno.customInspect")] = customInspect;
 * ```
 */
export function customInspect(
  this: Float16Array,
  inspect: typeof Deno.inspect,
  options?: Deno.InspectOptions | undefined,
): string {
  const length = this.length;

  const array = [];
  for (let i = 0; i < length; ++i) {
    array[i] = this[i];
  }

  return `Float16Array(${length}) ${inspect(array, options)}`;
}
