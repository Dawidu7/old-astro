"use client"

import clsx from "clsx"
import { useState } from "react"
import type { Options } from "./page"
import {
  Box,
  Button,
  Form,
  Input,
  Modal,
  SearchSelect,
  Separator,
} from "~/components"

export default function Component({ options }: { options: Options }) {
  const [rows, setRows] = useState<Record<string, unknown>[]>([])

  async function addRow(formData: Record<string, unknown>) {
    setRows(prev => [...prev, formData])
  }

  console.log(rows)

  return (
    <div className="relative mx-2 w-full max-w-7xl">
      <Box className="full absolute bottom-full right-4 w-fit space-x-4 p-1.5 text-sm">
        <Button className="px-2 py-0" variant="secondary">
          Delete All
        </Button>
        <Modal
          title="Add Row"
          trigger={<Button className="px-2 py-0">+</Button>}
        >
          {({ onClose }) => (
            <Form action={addRow} className="w-80">
              <SearchSelect
                label="Catalog"
                options={options.catalog}
                name="catalog"
              />
              <Input label="Number" name="number" />
              <SearchSelect
                label="Constellation"
                options={options.constellation}
                name="constellation"
              />
              <SearchSelect
                label="Telescope"
                options={options.telescope}
                name="telescope"
              />
              <SearchSelect
                label="Camera"
                options={options.camera}
                name="camera"
              />
              <SearchSelect
                label="Filter"
                options={options.filter}
                name="filter"
              />
              <Input label="RA" name="ra" />
              <Input label="DEC" name="dec" />
              <Input label="Info" name="info" />
              <SearchSelect
                label="Angle"
                // @ts-expect-error
                options={options.angle.map(angle => ({
                  ...angle,
                  name: Number(angle.name),
                }))}
                name="angle"
              />
              <Button type="submit" onPress={onClose}>
                Add Row
              </Button>
            </Form>
          )}
        </Modal>
      </Box>
      <Box className="">
        <table className="w-full">
          <thead className="font-semibold">
            <tr>
              <td>Catalog</td>
              <td>Number</td>
              <td>Constellation</td>
              <td>Telescope</td>
              <td>Camera</td>
              <td>Filter</td>
              <td>RA</td>
              <td>DEC</td>
              <td>Info</td>
              <td>Angle</td>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr className={clsx(i % 2 === 0 && "bg-zinc-800")} key={i}>
                <td>{(row.catalog as { name: string }).name}</td>
                <td>{row.number as string}</td>
                <td>{(row.constellation as { name: string }).name}</td>
                <td>{(row.telescope as { name: string }).name}</td>
                <td>{(row.camera as { name: string }).name}</td>
                <td>{(row.filter as { name: string }).name}</td>
                <td>RA {row.ra as string}</td>
                <td>DEC {row.dec as string}</td>
                <td>{row.info as string}</td>
                <td>{(row.angle as { name: string }).name}°</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
    </div>
  )
}
