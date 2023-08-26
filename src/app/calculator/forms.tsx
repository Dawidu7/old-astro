import { Button, Form, Input, Group } from "~/components"
import type { Camera, FlattReduc, Telescope } from "~/db/schema"

type FormProps = {
  onClose: () => void
  onChange: (
    name: string,
    value: Camera | FlattReduc | Telescope,
    onClose?: () => void,
  ) => void
}

function Camera({ onClose, onChange }: FormProps) {
  async function action(formData: Record<string, unknown>) {
    onChange("camera", formData as Camera, onClose)
  }

  return (
    <Form action={action}>
      <Input label="Name" name="name" />
      <Group separator="x">
        <Input
          label="Resolution X"
          name="resolutionX"
          type="number"
          minValue={0}
        />
        <Input
          label="Resolution Y"
          name="resolutionY"
          type="number"
          minValue={0}
        />
      </Group>
      <Group separator="x">
        <Input
          label="Matrix X"
          name="matrixX"
          type="number"
          minValue={0}
          step={0.01}
        />
        <Input
          label="Matrix Y"
          name="matrixY"
          type="number"
          minValue={0}
          step={0.01}
        />
      </Group>
      <Input
        label="Pixel Size"
        name="pixelSize"
        type="number"
        minValue={0}
        step={0.01}
      />
      <Button type="submit">Add</Button>
    </Form>
  )
}

function FlattReduc({ onClose, onChange }: FormProps) {
  async function action(formData: Record<string, unknown>) {
    onChange("flattReduc", formData as FlattReduc, onClose)
  }

  return (
    <Form action={action}>
      <Input label="Name" name="name" />
      <Input
        label="Times"
        name="times"
        type="number"
        minValue={0}
        step={0.01}
      />
      <Button type="submit">Add</Button>
    </Form>
  )
}

function Telescope({ onClose, onChange }: FormProps) {
  async function action(formData: Record<string, unknown>) {
    onChange("telescope", formData as Telescope, onClose)
  }

  return (
    <Form action={action}>
      <Input label="Name" name="name" />
      <Input
        label="Focal Length"
        name="focalLength"
        type="number"
        minValue={0}
      />
      <Input label="Diameter" name="diameter" type="number" minValue={0} />
      <Input
        label="Focal Ratio"
        name="focalRatio"
        type="number"
        step={0.01}
        minValue={0}
      />
      <Button type="submit">Add</Button>
    </Form>
  )
}

export default {
  camera: Camera,
  flattReduc: FlattReduc,
  telescope: Telescope,
}
