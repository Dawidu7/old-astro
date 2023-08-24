import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { Button, Form, Group, Input, Modal } from ".."
import db from "~/db"
import { catalog } from "~/db/schema"

export default async function Catalog({ searchParams }: SearchParams) {
  const defaultCatalog = searchParams.id
    ? (
        await db
          .select()
          .from(catalog)
          .where(eq(catalog.id, parseInt(searchParams.id)))
      )[0]
    : null

  async function create(formData: Record<string, unknown>) {
    "use server"

    // @ts-expect-error
    await db.insert(catalog).values(formData)

    revalidatePath("/dashboard")
  }

  async function update(formData: Record<string, unknown>) {
    "use server"

    await db
      .update(catalog)
      .set(formData)
      .where(eq(catalog.id, defaultCatalog?.id || 0))

    revalidatePath("/dashboard")
  }

  async function remove() {
    "use server"

    await db.delete(catalog).where(eq(catalog.id, defaultCatalog?.id || 0))

    revalidatePath("/dashboard")
  }

  return (
    <Form action={defaultCatalog ? update : create}>
      <Input label="Name" name="name" defaultValue={defaultCatalog?.name} />
      <Input label="Value" name="value" defaultValue={defaultCatalog?.value} />
      <Group>
        {defaultCatalog && (
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
                Are you sure you want to delete <b>{defaultCatalog.name}</b>?
              </span>
              <Button formAction={remove} type="submit" variant="destructive">
                Delete
              </Button>
            </form>
          </Modal>
        )}
        <Button type="submit">{defaultCatalog ? "Update" : "Create"}</Button>
      </Group>
    </Form>
  )
}
