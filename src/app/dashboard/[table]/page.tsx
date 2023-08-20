"use client"

import { useState } from "react"
import { action, create } from "~/lib/actions"
import { schemas } from "~/lib/utils"

export default function Table({ params }: Params) {
  const table = schemas[params.table as keyof typeof schemas]
  const [errors, setErrors] = useState<Record<string, string>>({})

  return (
    <form action={action}>
      <input type="text" name="Name" placeholder="Name" />
      <input type="submit" value="Submit" />
    </form>
  )

  if (!table) {
    return "No table found."
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    // Format form data
    const data = Array.from(e.currentTarget.elements).reduce((acc, element) => {
      if (!element.hasAttribute("name")) return acc

      const { name, type, value } = element as HTMLInputElement

      return {
        ...acc,
        [name]:
          type === "number"
            ? isNaN(parseFloat(value))
              ? undefined
              : parseFloat(value)
            : value,
      }
    }, {})

    const result = await create(data)

    if (!result.success) {
      return setErrors(result.issues)
    }

    console.log(result)
  }

  console.log(errors)

  return (
    <form onSubmit={onSubmit}>
      <input type="hidden" name="tableName" value={params.table} readOnly />
      {Object.values(table)
        .filter(({ name }: { name: string }) => name !== "id")
        .map(({ name, dataType }: { name: string; dataType: string }) => (
          <input className="border" key={name} name={name} type={dataType} />
        ))}
      <input type="submit" value="Submit" />
    </form>
  )
}
