"use client"

import clsx from "clsx"
import { useRouter } from "next/navigation"
import { Link, Searchbar } from "~/components"

export default function Filters({
  tables,
  searchParams,
}: { tables: string[] } & SearchParams) {
  const { replace } = useRouter()

  function getSearchParams(table: string) {
    if (searchParams.tables?.includes(table)) {
      return {
        ...searchParams,
        tables: searchParams.tables.split(",").filter(tab => tab !== table),
      }
    }

    return {
      ...searchParams,
      tables: searchParams.tables
        ? [...searchParams.tables.split(","), table]
        : [table],
    }
  }

  return (
    <nav className="flex items-center justify-between">
      <Searchbar
        callback={q =>
          replace(`/dashboard?${new URLSearchParams({ ...searchParams, q })}`)
        }
        label="Search"
      />
      <ul className="flex gap-4 capitalize">
        {tables.map(table => (
          <li key={table}>
            <Link
              className={clsx(
                searchParams.tables?.includes(table) && "text-white",
              )}
              // @ts-expect-error
              href={`/dashboard?${new URLSearchParams(getSearchParams(table))}`}
            >
              {table}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
