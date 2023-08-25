import { Separator } from "~/components"
import forms from "~/components/forms"

export default function Table({ params, searchParams }: Params & SearchParams) {
  const Form = forms[params.table as keyof typeof forms]

  if (!Form) {
    return "No form found."
  }

  return (
    <div className="mx-auto space-y-2">
      <h3 className="text-3xl font-semibold capitalize">
        Create {params.table}
      </h3>
      <Separator />
      <Form searchParams={searchParams} />
    </div>
  )
}
