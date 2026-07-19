/**
 * Tiny className helper — joins truthy string segments.
 * Prefer this over nested ternaries when composing NativeWind classes.
 */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}
