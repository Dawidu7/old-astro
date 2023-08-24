import { eq } from "drizzle-orm"
import { Button, Form, Group, Input, Modal } from ".."
import db from "~/db"
import { telescope } from "~/db/schema"

export default async function Telescope({ id }: { id?: number }) {
  const defaultTelescope = id
    ? (await db.select().from(telescope).where(eq(telescope.id, id)))[0]
    : null

  async function create(formData: Record<string, unknown>) {
    "use server"

    // @ts-expect-error
    await db.insert(telescope).values(formData)
  }

  async function update(formData: Record<string, unknown>) {
    "use server"

    await db
      .update(telescope)
      .set(formData)
      .where(eq(telescope.id, defaultTelescope?.id || 0))
  }

  async function remove() {
    "use server"

    await db
      .delete(telescope)
      .where(eq(telescope.id, defaultTelescope?.id || 0))
  }

  return (
    <Form action={defaultTelescope ? update : create}>
      <Input label="Name" name="name" defaultValue={defaultTelescope?.name} />
      <Input
        label="Focal Length"
        name="focalLength"
        type="number"
        minValue={0}
        defaultValue={defaultTelescope?.focalLength.toString()}
      />
      <Input
        label="Diameter"
        name="diameter"
        type="number"
        minValue={0}
        defaultValue={defaultTelescope?.diameter.toString()}
      />
      <Input
        label="Focal Ratio"
        name="focalRatio"
        type="number"
        step={0.01}
        minValue={0}
        defaultValue={defaultTelescope?.focalRatio.toString()}
      />
      <Group>
        {defaultTelescope && (
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
                Are you sure you want to delete <b>{defaultTelescope.name}</b>?
              </span>
              <Button formAction={remove} type="submit" variant="destructive">
                Delete
              </Button>
            </form>
          </Modal>
        )}
        <Button type="submit">{defaultTelescope ? "Update" : "Create"}</Button>
      </Group>
    </Form>
  )
}
