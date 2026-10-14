/**
 * Whether a value is one of a list of names, narrowing it to the list's
 * type: a component's check of a prop against its allowed values.
 */
export function isOneOf<Name extends string>(
  names: readonly Name[],
  value: unknown,
): value is Name {
  return (names as readonly unknown[]).includes(value);
}
