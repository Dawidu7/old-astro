import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { Button, Form, Group, Input, Modal } from ".."
import db from "~/db"
import { camera } from "~/db/schema"

export default async function Camera({ searchParams }: SearchParams) {
  const defaultCamera = searchParams.id
    ? (
        await db
          .select()
          .from(camera)
          .where(eq(camera.id, parseInt(searchParams.id)))
      )[0]
    : null

  async function create(formData: Record<string, unknown>) {
    "use server"

    // @ts-expect-error
    await db.insert(camera).values(formData)

    revalidatePath("/dashboard")
  }

  async function update(formData: Record<string, unknown>) {
    "use server"

    await db
      .update(camera)
      .set(formData)
      .where(eq(camera.id, defaultCamera?.id || 0))

    revalidatePath("/dashboard")
  }

  async function remove() {
    "use server"

    await db.delete(camera).where(eq(camera.id, defaultCamera?.id || 0))

    revalidatePath("/dashboard")
  }

  return (
    <Form action={defaultCamera ? update : create}>
      <Input label="Name" name="name" defaultValue={defaultCamera?.name} />
      <Group separator="x">
        <Input
          label="Resolution X"
          name="resolutionX"
          type="number"
          minValue={0}
          defaultValue={defaultCamera?.resolutionX.toString()}
        />
        <Input
          label="Resolution Y"
          name="resolutionY"
          type="number"
          minValue={0}
          defaultValue={defaultCamera?.resolutionY.toString()}
        />
      </Group>
      <Group separator="x">
        <Input
          label="Matrix X"
          name="matrixX"
          type="number"
          minValue={0}
          step={0.01}
          defaultValue={defaultCamera?.matrixX.toString()}
        />
        <Input
          label="Matrix Y"
          name="matrixY"
          type="number"
          minValue={0}
          step={0.01}
          defaultValue={defaultCamera?.matrixY.toString()}
        />
      </Group>
      <Input
        label="Pixel Size"
        name="pixelSize"
        type="number"
        minValue={0}
        step={0.01}
        defaultValue={defaultCamera?.pixelSize.toString()}
      />
      <Group>
        {defaultCamera && (
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
                Are you sure you want to delete <b>{defaultCamera.name}</b>?
              </span>
              <Button formAction={remove} type="submit" variant="destructive">
                Delete
              </Button>
            </form>
          </Modal>
        )}
        <Button type="submit">{defaultCamera ? "Update" : "Create"}</Button>
      </Group>
    </Form>
  )
}
