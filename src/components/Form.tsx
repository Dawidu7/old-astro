"use client"

import clsx from "clsx"
import { Children, cloneElement, isValidElement, useState } from "react"
import type { ComponentProps } from "react"
import { twMerge } from "tailwind-merge"

type FormProps = Omit<ComponentProps<"form">, "onSubmit"> & {
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

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    // Format form data
    const data = Array.from(e.currentTarget.elements).reduce((acc, element) => {
      if (!element.hasAttribute("name")) return acc

      const { name, type, value } = element as HTMLInputElement

      return {
        ...acc,
        [name]:
          type === "number"
            ? isNaN(parseFloat(value))
              ? undefined
              : parseFloat(value)
            : value,
      }
    }, {})

    console.log(data)
  }

  return (
    <form
      className={twMerge(clsx("flex flex-col gap-4", className))}
      onSubmit={onSubmit}
      {...props}
    >
      {getFormChildren(children, errors)}
    </form>
  )
}

function getFormChildren(
  children: React.ReactNode,
  errors: Record<string, string>,
): React.ReactNode {
  return Children.map(children, child => {
    if (!child || !isValidElement(child)) return child

    const { props } = child as JSX.Element

    if (props.name) {
      return cloneElement(child as JSX.Element, {
        errorMessage: errors[props.name] || undefined,
      })
    }

    if (props.role === "group") {
      return cloneElement(child as JSX.Element, {
        children: getFormChildren(props.children, errors),
      })
    }

    return child
  })
}
