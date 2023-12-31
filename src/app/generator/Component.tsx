"use client"

import { useRef, useState } from "react"
import {
  Box,
  Button,
  Form,
  Group,
  Input,
  SearchSelect,
  Separator,
} from "~/components"
import { saveFile } from "~/lib/utils"

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
      if (isInvalid(value)) return

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

  function save() {
    if (DSs.length === 0) return

    saveFile(
      [
        "SkySafariObservingListVersion=3.0\n",
        "SortedBy=Default Order",
        ...DSs.map(({ id, name }) =>
          [
            "\n",
            "SkyObject=BeginObject",
            `ObjectID=${id}, -1, -1`,
            `CatalogNumber=${name}`,
            "EndObject=SkyObject",
          ].join("\n"),
        ),
      ],
      "generator",
      "skylist",
    )
  }

  return (
    <div className="flex w-full justify-evenly gap-4 text-base max-[560px]:flex-col">
      <Box className="h-min min-[560px]:w-fit">
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
      <Box className="h-min space-y-4 min-[560px]:w-fit">
        <Group>
          <Button onPress={save}>Save</Button>
          <Button onPress={() => setDSs([])}>Delete All</Button>
        </Group>
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

function isInvalid(input: string) {
  if (!input.includes("-")) {
    return !input.match(/^[0-9]+$/)
  }

  const split = input.split("-")

  if (split.some(value => !value.match(/^[0-9]+$/))) return true
  if (Number(split[0]) >= Number(split[1])) return true

  return false
}
