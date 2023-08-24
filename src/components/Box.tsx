import clsx from "clsx"
import type { ComponentProps } from "react"
import { twMerge } from "tailwind-merge"

type BoxProps = ComponentProps<"div"> & {
  paddingLess?: boolean
}

export default function Box({
  children,
  className,
  paddingLess,
  ...props
}: BoxProps) {
  return (
    <div
      className={twMerge(
        clsx(
          "w-full rounded bg-zinc-900 shadow-lg shadow-black",
          !paddingLess && "p-4",
          className,
        ),
      )}
      {...props}
    >
      {children}
    </div>
  )
}
