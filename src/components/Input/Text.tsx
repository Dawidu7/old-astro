"use client"

import { forwardRef, useRef } from "react"
import { mergeProps, useTextField } from "react-aria"
import type { AriaTextFieldProps } from "react-aria"
import { useInputProps } from "."
import { mergeRefs } from "~/lib/utils"

export default forwardRef<HTMLInputElement, AriaTextFieldProps>(
  function Text(props, forwardedRef) {
    const { errorMessage, label } = props
    const ref = useRef<HTMLInputElement>(null)
    const { errorMessageProps, inputProps, labelProps } = useTextField(
      { ...props, placeholder: " " },
      ref,
    )
    const { errorClass, focusWithinProps, inputClass, isFocused, labelClass } =
      useInputProps(!!errorMessage)

    return (
      <>
        <input
          className={inputClass}
          data-focused={isFocused || undefined}
          ref={mergeRefs(ref, forwardedRef)}
          {...mergeProps(inputProps, focusWithinProps)}
        />
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
  },
)
