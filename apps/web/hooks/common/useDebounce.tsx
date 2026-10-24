import React, { useState } from "react"

const useDebounce = ({ query }: { query: string }) => {
  const [debouncedQuery, setDebouncedQuery] = useState(query)

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query)
    }, 500)

    return () => {
      clearTimeout(timer)
    }
  }, [query])

  return debouncedQuery
}

export default useDebounce
