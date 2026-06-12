/**
 * Drop keys whose value is `undefined`. Mappers diff their output against the
 * live server config, so an omitted option must be absent rather than an
 * explicit `undefined`, which json-diff-ts would otherwise report as a spurious
 * change.
 */
export function withoutUndefined<T extends Record<string, unknown>>(
  obj: T,
): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([, value]: [string, unknown]) => value !== undefined,
    ),
  ) as Partial<T>;
}
