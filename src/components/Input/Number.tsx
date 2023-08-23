"use client"

import { forwardRef, useRef } from "react"
import type { ComponentProps } from "react"
import { mergeProps, useLocale, useNumberField } from "react-aria"
import type { AriaNumberFieldProps } from "react-aria"
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai"
import { useNumberFieldState } from "react-stately"
import type { NumberFieldStateOptions } from "react-stately"
import { useInputProps } from "."
import { Button } from ".."
import { mergeRefs } from "~/lib/utils"

type NumberProps = AriaNumberFieldProps &
  Pick<ComponentProps<"input">, "name"> &
  NumberFieldStateOptions

export default forwardRef<HTMLInputElement, NumberProps>(function Number(
  { name, ...props },
  forwardedRef,
) {
  const { errorMessage, label } = props
  const ref = useRef<HTMLInputElement>(null)
  const { locale } = useLocale()
  const state = useNumberFieldState({ ...props, locale })
  const {
    decrementButtonProps,
    errorMessageProps,
    groupProps,
    incrementButtonProps,
    inputProps,
    labelProps,
  } = useNumberField({ ...props, placeholder: " " }, state, ref)
  const { errorClass, focusWithinProps, inputClass, isFocused, labelClass } =
    useInputProps(!!errorMessage)

  return (
    <>
      <input
        className={inputClass}
        data-focused={isFocused || undefined}
        ref={mergeRefs(ref, forwardedRef)}
        {...mergeProps(inputProps, focusWithinProps)}
        name={name}
      />
      <div className="absolute right-0 top-1 flex flex-col" {...groupProps}>
        <Button
          className="text-sm text-zinc-400 data-[hovered]:text-white"
          plain
          {...incrementButtonProps}
        >
          <AiFillCaretUp />
        </Button>
        <Button
          className="text-sm text-zinc-400 data-[hovered]:text-white"
          plain
          {...decrementButtonProps}
        >
          <AiFillCaretDown />
        </Button>
      </div>
      <label className={labelClass} {...labelProps}>
        {label}
      </label>
      {errorMessage && (
        <p className={errorClass} {...errorMessageProps}>
          {errorMessage}
        </p>
      )}
    </>
  )
})
