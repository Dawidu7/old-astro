import { eq } from "drizzle-orm"
import db from "~/db"
import { image as imageSchema } from "~/db/schema"

export default async function ImagePage({ params }: Params) {
  const image = await db
    .select()
    .from(imageSchema)
    .where(eq(imageSchema.name, params.name.replace("-", " ")))

  console.log(image, params.name)

  return <div>{JSON.stringify(image)}</div>
}
