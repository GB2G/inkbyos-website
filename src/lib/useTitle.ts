import { useEffect } from 'react'

/** Set document.title for the current page. */
export function useTitle(title: string): void {
  useEffect(() => {
    document.title = title
  }, [title])
}
