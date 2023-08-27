"use client"

import { useRef, useState } from "react"
import { Box, Button, Form, Input, SearchSelect, Separator } from "~/components"

export default function Component({
  catalogs,
}: {
  catalogs: { id: number; name: string; value: string }[]
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [DSs, setDSs] = useState<{ id: 3 | 4; name: string }[]>([])

  async function addDS(formData: Record<string, unknown>) {
    const catalog = formData.catalog as { name: string; value?: string }
    const values = (formData.numbers as string).split(" ")

    values.forEach(value => {
      if (!value.includes("-")) {
        setDSs(prev => [
          ...prev,
          {
            id: "value" in catalog ? 4 : 3,
            name: `${"value" in catalog ? `${catalog.value} ` : ""}${value}`,
          },
        ])

        return
      }

      const range = value.split("-").map(Number)

      for (let i = range[0]; i <= range[1]; i++) {
        setDSs(prev => [
          ...prev,
          {
            id: "value" in catalog ? 4 : 3,
            name: `${"value" in catalog ? `${catalog.value} ` : ""}${i}`,
          },
        ])
      }
    })
  }

  return (
    <div className="flex w-full justify-evenly">
      <Box className="h-min w-fit">
        <Form action={addDS}>
          <SearchSelect
            label="Catalog"
            options={[{ name: "None" }, ...catalogs]}
            name="catalog"
            defaultValue={{ name: "None" }}
          />
          <div className="relative">
            <Input ref={inputRef} label="Numbers" name="numbers" />
          </div>
          <Button type="submit">Add DS</Button>
        </Form>
      </Box>
      <Box className="h-min w-fit space-y-4">
        <div className="flex justify-between"></div>
        <Separator />
        <ul className="space-y-4">
          <li className="flex flex-col">
            <span>SkySafariObservingListVersion=3.0</span>
            <span>SortedBy=Default Order</span>
          </li>
          {DSs.map(({ id, name }, i) => (
            <li key={i}>
              <Button
                className="flex w-full flex-col rounded data-[hovered]:bg-zinc-700"
                onPress={() => setDSs(prev => prev.filter((_, j) => i !== j))}
                plain
              >
                <span>SkyObject=BeginObject</span>
                <span>ObjectID={id}, -1, -1</span>
                <span>CatalogNumber={name}</span>
                <span>EndObject=SkyObject</span>
              </Button>
            </li>
          ))}
        </ul>
      </Box>
    </div>
  )
}
