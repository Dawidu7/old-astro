import Selects from "./Selects"
import { Box, Separator } from "~/components"
import db from "~/db"

export default async function Calculator({ searchParams }: SearchParams) {
  const data = await getData()

  return (
    <Box className="flex gap-4">
      <Selects options={data} searchParams={searchParams} />
      <Separator orientation="vertical" />
    </Box>
  )
}

async function getData() {
  const [camera, flattReduc, telescope] = await Promise.all([
    db.query.camera.findMany(),
    db.query.flattReduc.findMany(),
    db.query.telescope.findMany(),
  ])

  return { camera, flattReduc, telescope }
}
