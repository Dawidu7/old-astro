import { revalidatePath } from "next/cache"
import { Box, Button, Form, Input, SearchSelect, Separator } from "~/components"
import db from "~/db"

const DSs: { id: 3 | 4; name: string }[] = []

async function addDS(formData: Record<string, unknown>) {
  "use server"

  const catalog = formData.catalog as { name: string; value?: string }
  const values = (formData.numbers as string).split(" ")

  values.forEach(value => {
    if (!value.includes("-")) {
      DSs.push({
        id: "value" in catalog ? 4 : 3,
        name: `${"value" in catalog ? `${catalog.value} ` : ""}${value}`,
      })

      revalidatePath("/generator")

      return
    }

    const range = value.split("-").map(Number)

    for (let i = range[0]; i <= range[1]; i++) {
      DSs.push({
        id: "value" in catalog ? 4 : 3,
        name: `${"value" in catalog ? `${catalog.value} ` : ""}${i}`,
      })
    }

    revalidatePath("/generator")
  })
}

export default async function Generator() {
  const catalogs = await db.query.catalog.findMany()

  console.log(DSs)

  return (
    <div className="flex w-full justify-evenly">
      <Box className="w-fit">
        <Form action={addDS}>
          <SearchSelect
            label="Catalog"
            options={[{ name: "None" }, ...catalogs]}
            name="catalog"
            defaultValue={{ name: "None" }}
          />
          <Input label="Numbers" name="numbers" />
          <Button type="submit">Add DS</Button>
        </Form>
      </Box>
      <Box className="h-min w-fit">
        <div className="flex justify-between"></div>
        <Separator />
        <ul></ul>
      </Box>
    </div>
  )
}
