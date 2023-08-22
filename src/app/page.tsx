import { Button, Form, Input, Select } from "~/components"

const HUMAN_OPTIONS = [
  { id: 1, name: "David", age: 17 },
  { id: 2, name: "Patrick", age: 44 },
  { id: 3, name: "Kacper", age: 12 },
  { id: 4, name: "Camille", age: 7 },
]

const TYPES = ["type1", "type2", "type3"]

export default function Home() {
  return (
    <Form>
      <Input label="Name" name="name" />
      <Input label="Bio" type="textarea" name="bio" />
      <Input label="Age" type="number" name="age" />
      <Select label="Human" options={HUMAN_OPTIONS} name="human" />
      <Select label="Type" options={TYPES} name="type" />
      <Button type="submit">Submit</Button>
    </Form>
  )
}
