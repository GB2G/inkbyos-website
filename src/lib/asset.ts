/** Resolve a path in /public against the app's base URL (handles the
 *  /inkbyos-website/ GitHub Pages sub-path and a future custom domain). */
export const asset = (path: string): string =>
  import.meta.env.BASE_URL + path.replace(/^\//, '')
