import { RxPlus } from "react-icons/rx"
import Filters from "./Filters"
import { Link, Separator } from "~/components"
import db from "~/db"
import { filterObject } from "~/lib/utils"

export default async function Dashboard({ searchParams }: SearchParams) {
  if (!searchParams.app) return "Choose an app."

  const data = await getData(searchParams.app as string)

  if (!data) return "No data found."

  const filteredData = filterData(
    data,
    searchParams.q as string,
    searchParams.tables?.split(","),
  )

  return (
    <div className="flex-1 space-y-4">
      <Filters tables={Object.keys(data)} searchParams={searchParams} />
      <Separator />
      <div className="grid gap-4 grid-auto-fit-sm">
        {Object.entries(filteredData).map(
          ([table, values]) =>
            (!searchParams.tables ||
              searchParams.tables.split(",").includes(table)) && (
              <div key={table}>
                <h3 className="flex items-center justify-between font-semibold capitalize">
                  {table}s
                  <Link
                    href={`/dashboard/${
                      searchParams.app === "planner"
                        ? `option?type=${table}`
                        : table
                    }`}
                  >
                    <RxPlus />
                  </Link>
                </h3>
                <ul>
                  {(values as any).map(
                    (value: any) =>
                      (!searchParams.q ||
                        value.name
                          .toLowerCase()
                          .includes(searchParams.q.toLowerCase())) && (
                        <li key={value.id}>
                          <Link
                            className="block w-full rounded data-[hovered]:bg-zinc-700 data-[hovered]:pl-2"
                            href={`/dashboard/${
                              searchParams.app === "planner" ? "option" : table
                            }?id=${value.id}`}
                          >
                            {value.name}
                          </Link>
                        </li>
                      ),
                  )}
                </ul>
              </div>
            ),
        )}
      </div>
    </div>
  )
}

function filterData(
  data: Record<string, unknown>,
  q: string,
  tables: string[] | undefined,
) {
  const _filteredDataByTables = tables ? filterObject(data, tables) : {}
  const filteredDataByTables =
    Object.keys(_filteredDataByTables).length === 0
      ? data
      : _filteredDataByTables

  if (!q) return filteredDataByTables

  return Object.fromEntries(
    Object.entries(filteredDataByTables)
      .map(([table, data]) => [
        table,
        data.filter(({ name }: { name: string }) =>
          name.toLowerCase().includes(q.toLowerCase()),
        ),
      ])
      .filter(([, data]) => data.length !== 0),
  )
}

async function getData(app: string | undefined) {
  switch (app) {
    case "gallery":
      const image = await db.query.image.findMany()

      return { image }
    case "calculator":
      const [camera, flattReduc, telescope] = await Promise.all([
        db.query.camera.findMany(),
        db.query.flattReduc.findMany(),
        db.query.telescope.findMany(),
      ])

      return { camera, flattReduc, telescope }
    case "generator":
      const catalog = await db.query.catalog.findMany()

      return { catalog }
    case "planner":
      const options = await db.query.option.findMany()

      return options.reduce((acc, option) => {
        const typeArray = acc[option.type as keyof typeof acc]

        return {
          ...acc,
          [option.type]: !typeArray ? [option] : [...typeArray, option],
        }
      }, {})
    default:
      return null
  }
}
