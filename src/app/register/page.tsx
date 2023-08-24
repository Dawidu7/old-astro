import db from "~/db"
import { admin } from "~/db/schema"
import { hash } from "bcrypt"

async function action(formData: FormData) {
  "use server"

  const password = await hash(formData.get("password") as string, 10)

  await db.insert(admin).values({ password })
}

export default function page() {
  return (
    <form action={action}>
      <input type="text" name="password" />
    </form>
  )
}
