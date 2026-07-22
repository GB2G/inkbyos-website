/** Resolve a path in /public against the app's base URL. */
export const asset = (path: string): string =>
  import.meta.env.BASE_URL + path.replace(/^\//, '')
