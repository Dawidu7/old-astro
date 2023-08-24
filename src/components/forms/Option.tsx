import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { Button, Form, Group, Input, Modal, Select } from ".."
import db from "~/db"
import { option } from "~/db/schema"

export default async function Option({ searchParams }: SearchParams) {
  const defaultOption = searchParams.id
    ? (
        await db
          .select()
          .from(option)
          .where(eq(option.id, parseInt(searchParams.id)))
      )[0]
    : null

  async function create(formData: Record<string, unknown>) {
    "use server"

    // @ts-expect-error
    await db.insert(option).values(formData)

    revalidatePath("/dashboard")
  }

  async function update(formData: Record<string, unknown>) {
    "use server"

    await db
      .update(option)
      .set(formData)
      .where(eq(option.id, defaultOption?.id || 0))

    revalidatePath("/dashboard")
  }

  async function remove() {
    "use server"

    await db.delete(option).where(eq(option.id, defaultOption?.id || 0))

    revalidatePath("/dashboard")
  }

  return (
    <Form action={defaultOption ? update : create}>
      <Input label="Name" name="name" defaultValue={defaultOption?.name} />
      <Select
        label="Type"
        name="type"
        options={[
          "angle",
          "camera",
          "catalog",
          "constellation",
          "filter",
          "telescope",
        ]}
        defaultValue={searchParams.type}
      />
      <Group>
        {defaultOption && (
          <Modal
            title="Confirm Delete"
            trigger={
              <Button className="flex-1" variant="destructive">
                Delete
              </Button>
            }
          >
            <form className="flex flex-col gap-4">
              <span className="text-lg">
                Are you sure you want to delete <b>{defaultOption.name}</b>?
              </span>
              <Button formAction={remove} type="submit" variant="destructive">
                Delete
              </Button>
            </form>
          </Modal>
        )}
        <Button type="submit">{defaultOption ? "Update" : "Create"}</Button>
      </Group>
    </Form>
  )
}
