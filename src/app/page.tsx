import { Button, Input } from "~/components"

async function action(formData: FormData) {
  "use server"

  console.log(formData)
}

export default function Home() {
  return (
    <form action={action}>
      <Input label="Name" />
      <Input label="Bio" type="textarea" />
      <Input label="Age" type="number" />
      <Input label="Date of Birth" type="date" />
      <Button type="submit">Click me!</Button>
    </form>
  )
}
