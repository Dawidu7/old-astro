import { Button, Form, Input } from "~/components"
import forms from "~/components/forms"

export default function Table({ params, searchParams }: Params & SearchParams) {
  const Form = forms[params.table as keyof typeof forms]

  if (!Form) {
    return "No form found."
  }

  return <Form id={parseInt(searchParams.id)} />
}
