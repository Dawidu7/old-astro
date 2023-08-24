import db from "~/db"
import { admin } from "~/db/schema"
import { eq } from "drizzle-orm"

export default async function Home() {
  console.log(await db.select().from(admin))

  return "Home"
}
