"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import type { ComponentProps } from "react"
import { Input } from "."

type SearchbarProps = Omit<
  ComponentProps<typeof Input>,
  "type" | "value" | "onChange"
> & {
  callback: (search: string) => void
}

export default function Searchbar({ callback, ...props }: SearchbarProps) {
  const defaultSearch = useSearchParams().get("q") || ""
  const [search, setSearch] = useState(defaultSearch)

  useEffect(() => {
    const timeout = setTimeout(() => {
      callback(search)
    }, 500)

    return () => clearTimeout(timeout)
  }, [callback, search])

  return (
    // @ts-expect-error
    <Input
      {...props}
      type="text"
      value={search}
      onChange={value => setSearch(value)}
    />
  )
}
