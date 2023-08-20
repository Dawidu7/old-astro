"use client"

import clsx from "clsx"
import { useSeparator } from "react-aria"
import type { SeparatorProps } from "react-aria"

export default function Separator(props: SeparatorProps) {
  const { separatorProps } = useSeparator(props)

  return (
    <div
      className={clsx(
        "bg-zinc-400",
        props.orientation === "vertical" ? "h-auto w-px" : "h-px w-full",
      )}
      {...separatorProps}
    />
  )
}
