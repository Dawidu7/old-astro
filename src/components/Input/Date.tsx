"use client"

import clsx from "clsx"
import { useRef } from "react"
import { mergeProps, useDateField, useDateSegment, useLocale } from "react-aria"
import type { AriaDateFieldProps } from "react-aria"
import { useDateFieldState } from "react-stately"
import type {
  DateFieldState,
  DateFieldStateOptions,
  DateSegment,
} from "react-stately"
import { createCalendar, parseDate } from "@internationalized/date"
import type { CalendarDate } from "@internationalized/date"
import { useInputProps } from "."

type DateProps = Omit<AriaDateFieldProps<CalendarDate>, "defaultValue"> &
  Omit<DateFieldStateOptions, "locale" | "createCalendar" | "defaultValue"> & {
    defaultValue?: Date
  }

type SegmentProps = {
  segment: DateSegment
  state: DateFieldState
}

export default function DateInput({ defaultValue, ...props }: DateProps) {
  const { errorMessage, label, name } = props
  const ref = useRef<HTMLInputElement>(null)
  const { locale } = useLocale()
  const state = useDateFieldState({
    ...props,
    locale,
    createCalendar,
    defaultValue: defaultValue
      ? parseDate(new Date(defaultValue!).toISOString().split("T")[0])
      : undefined,
  })
  const { errorMessageProps, fieldProps, labelProps } = useDateField(
    props,
    state,
    ref,
  )
  const { errorClass, focusWithinProps, isFocused } = useInputProps(
    !!errorMessage,
  )

  return (
    <div>
      {name && state.value && (
        <input
          type="hidden"
          data-date
          name={name}
          value={state.value.toString()}
        />
      )}
      <div
        className={clsx(
          "w-full border-b transition duration-300",
          isFocused ? "border-white" : "border-zinc-400",
        )}
      >
        <label
          className={clsx(
            "text-sm transition duration-300",
            isFocused ? "text-white" : "text-zinc-400",
          )}
          {...labelProps}
        >
          {label}
        </label>
        <div
          className="group flex w-fit gap-1"
          ref={ref}
          {...mergeProps(fieldProps, focusWithinProps)}
        >
          {state.segments.map((segment, i) => (
            <Segment key={i} segment={segment} state={state} />
          ))}
        </div>
      </div>
      {errorMessage && (
        <p className={errorClass} {...errorMessageProps}>
          {errorMessage}
        </p>
      )}
    </div>
  )
}

function Segment({ segment, state }: SegmentProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { segmentProps } = useDateSegment(segment, state, ref)
  const { focusWithinProps, isFocused } = useInputProps()

  return (
    <div
      className={clsx(
        "flex-1 outline-none transition duration-200",
        isFocused && "bg-indigo-600",
        segment.isPlaceholder || !segment.isEditable
          ? "text-zinc-400"
          : "text-white",
      )}
      ref={ref}
      {...mergeProps(segmentProps, focusWithinProps)}
    >
      {segment.text}
    </div>
  )
}
