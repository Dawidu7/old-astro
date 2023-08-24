import { RxPlus } from "react-icons/rx"
import { Link } from "~/components"
import db from "~/db"

export default async function Dashboard({ searchParams }: SearchParams) {
  const data = await getData(searchParams.app)

  if (!data) return "No data found."

  return (
    <div className="grid flex-1 gap-4 grid-auto-fit-sm">
      {Object.entries(data).map(([table, values]) => (
        <div key={table}>
          <h3 className="flex items-center justify-between font-semibold capitalize">
            {table}s
            <Link
              href={`/dashboard/${
                searchParams.app === "planner" ? "option" : table
              }${searchParams.app === "planner" ? `?type=${table}` : ""}`}
            >
              <RxPlus />
            </Link>
          </h3>
          <ul>
            {(values as any).map((value: any) => (
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
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

async function getData(app: string | undefined) {
  switch (app) {
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
