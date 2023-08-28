"use client"

import clsx from "clsx"
import { useState } from "react"
import { FiEdit, FiTrash2 } from "react-icons/fi"
import type { Options } from "./page"
import { Box, Button, Form, Input, Modal, SearchSelect } from "~/components"

export default function Component({ options }: { options: Options }) {
  const [rows, setRows] = useState<Record<string, unknown>[]>([])

  async function addRow(formData: Record<string, unknown>) {
    setRows(prev => [...prev, formData])
  }

  async function editRow({ i, ...formData }: Record<string, unknown>) {
    setRows(prev =>
      prev.map((value, j) => (Number(i) === j ? formData : value)),
    )
  }

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
              <tr
                className={clsx("relative", i % 2 === 0 && "bg-zinc-800")}
                key={i}
              >
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
                <td className="absolute right-0 top-[15%] flex gap-1">
                  <Modal
                    title="Edit Row"
                    trigger={
                      <Button
                        className="text-zinc-400 data-[hovered]:text-white"
                        plain
                      >
                        <FiEdit />
                      </Button>
                    }
                  >
                    {({ onClose }) => (
                      <Form action={editRow} className="w-80">
                        <input type="hidden" readOnly value={i} name="i" />
                        <SearchSelect
                          label="Catalog"
                          options={options.catalog}
                          name="catalog"
                          defaultValue={row.catalog as { name: string }}
                        />
                        <Input
                          label="Number"
                          name="number"
                          defaultValue={row.number as string}
                        />
                        <SearchSelect
                          label="Constellation"
                          options={options.constellation}
                          name="constellation"
                          defaultValue={row.constellation as { name: string }}
                        />
                        <SearchSelect
                          label="Telescope"
                          options={options.telescope}
                          name="telescope"
                          defaultValue={row.telescope as { name: string }}
                        />
                        <SearchSelect
                          label="Camera"
                          options={options.camera}
                          name="camera"
                          defaultValue={row.camera as { name: string }}
                        />
                        <SearchSelect
                          label="Filter"
                          options={options.filter}
                          name="filter"
                          defaultValue={row.filter as { name: string }}
                        />
                        <Input
                          label="RA"
                          name="ra"
                          defaultValue={row.ra as string}
                        />
                        <Input
                          label="DEC"
                          name="dec"
                          defaultValue={row.dec as string}
                        />
                        <Input
                          label="Info"
                          name="info"
                          defaultValue={row.info as string}
                        />
                        <SearchSelect
                          label="Angle"
                          // @ts-expect-error
                          options={options.angle.map(angle => ({
                            ...angle,
                            name: Number(angle.name),
                          }))}
                          name="angle"
                          defaultValue={row.angle as { name: string }}
                        />
                        <Button type="submit" onPress={onClose}>
                          Edit Row
                        </Button>
                      </Form>
                    )}
                  </Modal>
                  <Button
                    className="text-zinc-400 data-[hovered]:text-white"
                    plain
                    onPress={() =>
                      setRows(prev => prev.filter((_, j) => i !== j))
                    }
                  >
                    <FiTrash2 />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
    </div>
  )
}
