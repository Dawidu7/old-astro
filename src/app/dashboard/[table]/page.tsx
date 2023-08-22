import { Button, Form, Input } from "~/components"
import { schemas } from "~/lib/utils"

export default function Table({ params }: Params) {
  const table = schemas[params.table as keyof typeof schemas]

  if (!table) {
    return "No table found."
  }

  return (
    <Form>
      <Button className="capitalize" type="submit">
        Add {params.table}
      </Button>
    </Form>
  )
}
