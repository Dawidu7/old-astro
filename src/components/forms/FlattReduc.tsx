import { eq } from "drizzle-orm"
import { Button, Form, Group, Input, Modal } from ".."
import db from "~/db"
import { flattReduc } from "~/db/schema"

export default async function FlattReduc({ searchParams }: SearchParams) {
  const defaultFlattReduc = searchParams.id
    ? (
        await db
          .select()
          .from(flattReduc)
          .where(eq(flattReduc.id, parseInt(searchParams.id)))
      )[0]
    : null

  async function create(formData: Record<string, unknown>) {
    "use server"

    // @ts-expect-error
    await db.insert(flattReduc).values(formData)
  }

  async function update(formData: Record<string, unknown>) {
    "use server"

    await db
      .update(flattReduc)
      .set(formData)
      .where(eq(flattReduc.id, defaultFlattReduc?.id || 0))
  }

  async function remove() {
    "use server"

    await db
      .delete(flattReduc)
      .where(eq(flattReduc.id, defaultFlattReduc?.id || 0))
  }

  return (
    <Form action={defaultFlattReduc ? update : create}>
      <Input label="Name" name="name" defaultValue={defaultFlattReduc?.name} />
      <Input
        label="Times"
        name="times"
        type="number"
        minValue={0}
        step={0.01}
        defaultValue={defaultFlattReduc?.times.toString()}
      />
      <Group>
        {defaultFlattReduc && (
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
                Are you sure you want to delete <b>{defaultFlattReduc.name}</b>?
              </span>
              <Button formAction={remove} type="submit" variant="destructive">
                Delete
              </Button>
            </form>
          </Modal>
        )}
        <Button type="submit">{defaultFlattReduc ? "Update" : "Create"}</Button>
      </Group>
    </Form>
  )
}
