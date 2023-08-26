"use client"

import { useRouter } from "next/navigation"
import forms from "./forms"
import { Button, Modal, SearchSelect } from "~/components"
import type { Camera, FlattReduc, Telescope } from "~/db/schema"

export default function Selects({
  options,
  searchParams,
}: {
  options: {
    camera: Camera[]
    flattReduc: FlattReduc[]
    telescope: Telescope[]
  }
} & SearchParams) {
  const { replace } = useRouter()

  function onChange(
    name: string,
    value: Camera | FlattReduc | Telescope,
    onClose?: () => void,
  ) {
    if (typeof onClose === "function") {
      onClose()
    }

    replace(
      // @ts-expect-error
      `/calculator?${new URLSearchParams({
        ...searchParams,
        [name]: JSON.stringify(
          Object.fromEntries(
            Object.entries(value).filter(([key]) => key !== "id"),
          ),
        ),
      })}`,
    )
  }

  return (
    <ul className="space-y-6">
      {Object.entries(options).map(([name, values]) => (
        <li className="flex items-center gap-2" key={name}>
          <SearchSelect
            label={name}
            options={values}
            onChange={(value: Camera | FlattReduc | Telescope) =>
              onChange(name, value)
            }
            defaultValue={
              searchParams[name] ? JSON.parse(searchParams[name]!) : undefined
            }
          />
          <Modal
            title={`Add ${name}`}
            trigger={
              <Button className="px-1 py-0 text-2xl" variant="secondary">
                +
              </Button>
            }
          >
            {({ onClose }) => getForm(name, { onClose, onChange })}
          </Modal>
        </li>
      ))}
    </ul>
  )
}

function getForm(name: string, props?: any) {
  const Form = forms[name as keyof typeof forms]

  if (!Form) return null

  return <Form {...props} />
}
