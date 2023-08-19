"use client"

import clsx from "clsx"
import { forwardRef, useState } from "react"
import type { ComponentProps } from "react"
import { useFocusWithin } from "react-aria"
import Date from "./Date"
import Number from "./Number"
import Text from "./Text"
import TextArea from "./TextArea"

type InputProps = {
  label: React.ReactNode
} & (
  | ({ type: "date" } & ComponentProps<typeof Date>)
  | ({ type: "number" } & ComponentProps<typeof Number>)
  | ({ type: "textarea" } & ComponentProps<typeof TextArea>)
  | ComponentProps<typeof Text>
)

export default forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  function Input({ type = "text", ...props }, forwardedRef) {
    return (
      <div className={clsx("relative", type !== "date" && "mt-4 pt-1")}>
        {type === "date" ? (
          // @ts-expect-error
          <Date {...props} />
        ) : type === "number" ? (
          // @ts-expect-error ref
          <Number ref={forwardedRef} {...props} />
        ) : type === "textarea" ? (
          // @ts-expect-error ref
          <TextArea ref={forwardedRef} {...props} />
        ) : (
          // @ts-expect-error ref
          <Text ref={forwardedRef} {...props} />
        )}
      </div>
    )
  },
)

export function useInputProps(isError?: boolean) {
  const [isFocused, setFocus] = useState(false)
  const { focusWithinProps } = useFocusWithin({
    onFocusWithinChange: isFocusWithin => setFocus(isFocusWithin),
  })

  const labelClass = clsx(
    "absolute left-0 top-1 -z-10 -translate-y-5 text-sm transition-all duration-300",
    "peer-data-[focused]:-translate-y-5 peer-data-[focused]:text-sm",
    "peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-lg",
    isError ? "text-red-600" : "text-zinc-400 peer-data-[focused]:text-white",
  )

  const inputClass = clsx(
    "peer py-0.5 w-full border-b bg-inherit outline-none text-white transition duration-300",
    isError ? "border-red-600" : "border-zinc-400 data-[focused]:border-white",
  )

  const errorClass = "text-sm text-red-600"

  return { errorClass, focusWithinProps, labelClass, inputClass, isFocused }
}
