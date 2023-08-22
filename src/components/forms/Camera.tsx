import { eq } from "drizzle-orm"
import { Button, Form, Group, Input } from ".."
import db from "~/db"
import { camera } from "~/db/schema"

export default async function Camera({ id }: { id?: number }) {
  const defaultCamera = id
    ? (await db.select().from(camera).where(eq(camera.id, id)))[0]
    : null

  return (
    <Form>
      <Input label="Name" name="name" defaultValue={defaultCamera?.name} />
      <Group separator="x">
        <Input
          label="Resolution X"
          name="resolutionX"
          type="number"
          minValue={0}
          defaultValue={defaultCamera?.resolutionX}
        />
        <Input
          label="Resolution Y"
          name="resolutionY"
          type="number"
          minValue={0}
          defaultValue={defaultCamera?.resolutionY}
        />
      </Group>
      <Group separator="x">
        <Input
          label="Matrix X"
          name="matrixX"
          type="number"
          minValue={0}
          defaultValue={defaultCamera?.matrixX}
        />
        <Input
          label="Matrix Y"
          name="matrixY"
          type="number"
          minValue={0}
          defaultValue={defaultCamera?.matrixY}
        />
      </Group>
      <Input
        label="Pixel Size"
        name="pixelSize"
        type="number"
        minValue={0}
        defaultValue={defaultCamera?.pixelSize}
      />
      <Group>
        {id && <Button type="submit"></Button>}
        <Button type="submit">Create Camera</Button>
      </Group>
    </Form>
  )
}
