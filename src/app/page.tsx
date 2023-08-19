import db from "~/db"
import { camera } from "~/db/schema"

export default async function Home() {
  console.log(await db.select().from(camera))

  return <div>Home</div>
}
