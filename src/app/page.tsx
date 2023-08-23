import { Button, Form, Input, Group, Select } from "~/components"

const HUMAN_OPTIONS = [
  { id: 1, name: "David", age: 17 },
  { id: 2, name: "Patrick", age: 44 },
  { id: 3, name: "Kacper", age: 12 },
  { id: 4, name: "Camille", age: 7 },
]

const TYPES = ["type1", "type2", "type3"]

async function action(formData: Record<string, unknown>) {
  "use server"

  console.log(formData)
}

export default function Home() {
  return (
    <Form action={action}>
      <Input label="Name" name="name" />
      <Input label="Bio" type="textarea" name="bio" />
      <Input label="Age" type="number" name="age" />
      <Group separator="x">
        <Input label="Resolution X" type="number" name="resolutionX" />
        <Group separator="x">
          <Input label="Resolution Y" type="number" name="resolutionY" />
          <Input label="Resolution Z" type="number" name="resolutionZ" />
        </Group>
      </Group>
      <Select label="Human" options={HUMAN_OPTIONS} name="human" />
      <Select label="Type" options={TYPES} name="type" />
      <Button type="submit">Submit</Button>
    </Form>
  )
}
