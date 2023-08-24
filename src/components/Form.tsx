"use client"

import clsx from "clsx"
import { Children, cloneElement, isValidElement, useRef, useState } from "react"
import type { ComponentProps } from "react"
import { twMerge } from "tailwind-merge"
import { validate } from "~/lib/actions"

type FormProps = Omit<ComponentProps<"form">, "action" | "onSubmit"> & {
  action?: (formData: Record<string, unknown>) => Promise<unknown>
  errors?: Record<string, string>
}

export default function Form({
  action,
  children,
  className,
  errors: baseErrors,
  ...props
}: FormProps) {
  const [errors, setErrors] = useState(baseErrors || {})
  const [isLoading, setLoading] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const schema = getFormSchema(children)

  async function preAction() {
    const data = getFormData(formRef.current?.elements!)

    const result = await validate(schema, data)

    if (!result.success) {
      return setErrors(result.issues!)
    }

    setErrors({})

    if (action) {
      setLoading(true)
      await action(data)
      setLoading(false)
    }
  }

  return (
    <form
      action={preAction}
      className={twMerge(clsx("flex flex-col gap-4", className))}
      ref={formRef}
      {...props}
    >
      {getFormChildren(children, errors, isLoading)}
    </form>
  )
}

function getFormChildren(
  children: React.ReactNode,
  errors: Record<string, string>,
  isLoading: boolean,
): React.ReactNode {
  return Children.map(children, child => {
    if (!child || !isValidElement(child)) return child

    const { props } = child as JSX.Element

    if (props.name) {
      if (props.options) {
        return cloneElement(child as JSX.Element, {
          errorMessage: errors[props.name] || undefined,
        })
      }

      return cloneElement(child as JSX.Element, {
        errorMessage: errors[props.name] || undefined,
        isDisabled: isLoading || undefined,
      })
    }

    if (props.role === "group") {
      return cloneElement(child as JSX.Element, {
        children: getFormChildren(props.children, errors, isLoading),
      })
    }

    return child
  })
}

function getFormData(elements: HTMLFormControlsCollection) {
  return Array.from(elements).reduce<Record<string, unknown>>(
    (acc, element) => {
      if (!element.hasAttribute("name")) return acc

      const { inputMode, name, value } = element as HTMLInputElement
      const parsedPlaceholder = parseFloat(value.replaceAll(",", ""))
      const parsedValue = isNaN(parsedPlaceholder)
        ? undefined
        : parsedPlaceholder

      if (inputMode === "numeric") {
        return {
          ...acc,
          [name]: parsedValue,
        }
      }

      const matches = name.match(/(.+?)\[(.+?)\]/)

      if (!matches) {
        return { ...acc, [name]: value }
      }

      return {
        ...acc,
        [matches[1]]: {
          // @ts-expect-error
          ...acc[matches[1]],
          [matches[2]]: /[^0-9.,]/.test(value) ? value : parsedValue,
        },
      }
    },
    {},
  )
}

function getFormSchema(children: React.ReactNode): Record<string, string> {
  return Children.toArray(children).reduce((acc, child) => {
    if (!child || !isValidElement(child)) return acc

    const { props } = child as JSX.Element

    if (props.role === "group") {
      return { ...acc, ...getFormSchema(props.children) }
    }

    if (!props.name) return acc

    if (props.type === "number") {
      return { ...acc, [props.name]: "number" }
    }

    if (props.options) {
      if (typeof props.options[0] === "string") {
        return { ...acc, [props.name]: "string" }
      }

      return {
        ...acc,
        [props.name]: Object.entries(props.options[0]).reduce(
          (obj, [key, value]) => ({
            ...obj,
            [key]: typeof value === "number" ? "number" : "string",
          }),
          {},
        ),
      }
    }

    return { ...acc, [props.name]: "string" }
  }, {})
}
