import db from "~/db"
import Component from "./Component"

export default async function Generator() {
  const catalogs = await db.query.catalog.findMany()

  return <Component catalogs={catalogs} />
}
