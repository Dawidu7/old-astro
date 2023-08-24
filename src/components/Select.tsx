"use client"

import clsx from "clsx"
import { useEffect, useState } from "react"
import type { ComponentProps } from "react"
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai"
import { twMerge } from "tailwind-merge"
import { Listbox, Transition } from "@headlessui/react"

type SelectProps<T> = ComponentProps<typeof Listbox> & {
  label: React.ReactNode
  options: T[]
  defaultValue?: T
  errorMessage?: React.ReactNode
}

export default function Select<
  T extends
    | string
    | {
        id: number
        name: string
      },
>({ defaultValue, errorMessage, label, options, ...props }: SelectProps<T>) {
  const [selected, setSelected] = useState<T | null>(null)

  useEffect(() => defaultValue && setSelected(defaultValue), [defaultValue])

  return (
    <div className="relative mt-5">
      <Listbox value={selected} onChange={setSelected} {...props}>
        {({ open }) => (
          <>
            <Transition
              className="absolute"
              enter="transition duration-300"
              enterFrom="opacity-0 -translate-y-4"
              enterTo="opacity-1 -translate-y-6"
              show={!!selected}
            >
              <Listbox.Label
                className={twMerge(
                  clsx(
                    "text-sm transition duration-300",
                    open ? "text-white" : "text-zinc-400",
                    errorMessage && "text-red-600",
                  ),
                )}
              >
                {label}
              </Listbox.Label>
            </Transition>
            <Listbox.Button
              className={twMerge(
                clsx(
                  "flex w-full items-center justify-between border-b outline-none transition ui-focus-visible:ring-2",
                  open
                    ? "border-white text-white"
                    : "border-zinc-400 text-zinc-400",
                  errorMessage && "border-red-600",
                ),
              )}
            >
              <span
                className={twMerge(
                  clsx(
                    "capitalize",
                    open || selected ? "text-white" : "text-zinc-400",
                    errorMessage && "text-red-600",
                  ),
                )}
              >
                {typeof selected === "string"
                  ? selected
                  : selected?.name || `Select ${label}`}
              </span>
              {open ? <AiFillCaretUp /> : <AiFillCaretDown />}
            </Listbox.Button>
            <Transition
              className="relative z-50"
              enter="transition ease-in duration-200"
              enterFrom="opacity-0 -translate-y-2"
              enterTo="opacity-1"
              leave="transition ease-out duration-200"
              leaveFrom="opacity-1"
              leaveTo="opacity-0 -translate-y-2"
            >
              <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-y-scroll rounded bg-stone-800 shadow-md shadow-black outline-none">
                {options.map((option, i) => (
                  <Listbox.Option
                    className="px-1.5 capitalize ui-selected:bg-stone-900 ui-selected:font-semibold ui-active:bg-stone-900 ui-not-selected:ui-active:cursor-pointer"
                    key={i}
                    value={option}
                  >
                    {typeof option === "string" ? option : option.name}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </>
        )}
      </Listbox>
      {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}
    </div>
  )
}
