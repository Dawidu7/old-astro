import Component from "./Component"
import db from "~/db"

export default async function Planner() {
  const options = await getData()

  return <Component options={options} />
}

async function getData() {
  const options = await db.query.option.findMany()

  return options.reduce((acc, option) => {
    const typeArray = acc[option.type as keyof typeof acc]

    return {
      ...acc,
      [option.type]: !typeArray ? [option] : [...typeArray, option],
    }
  }, {}) as {
    angle: { id: number; name: string; type: "angle" }[]
    camera: { id: number; name: string; type: "camera" }[]
    catalog: { id: number; name: string; type: "catalog" }[]
    constellation: { id: number; name: string; type: "constellation" }[]
    filter: { id: number; name: string; type: "filter" }[]
    telescope: { id: number; name: string; type: "telescope" }[]
  }
}

export type Options = Awaited<ReturnType<typeof getData>>
