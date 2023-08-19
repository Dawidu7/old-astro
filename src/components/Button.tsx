"use client"

import clsx from "clsx"
import { cva } from "class-variance-authority"
import type { VariantProps } from "class-variance-authority"
import { forwardRef, useRef } from "react"
import type { ComponentProps } from "react"
import { mergeProps, useButton, useFocusRing, useHover } from "react-aria"
import type { AriaButtonProps } from "react-aria"
import { twMerge } from "tailwind-merge"
import { mergeRefs } from "~/lib/utils"

const variants = cva(
  "transition-all h-min outline-none data-[pressed]:scale-95 duration-200 data-[focus-visible]:ring-2",
  {
    variants: {
      plain: {
        false: "rounded shadow-md shadow-black px-3 py-1.5",
      },
      variant: {
        primary: "bg-indigo-600 ring-white data-[hovered]:bg-indigo-700",
        secondary:
          "bg-zinc-100 text-zinc-800 ring-indigo-600 data-[hovered]:bg-zinc-200",
        destructive: "bg-red-600 ring-white data-[hovered]:bg-red-700",
      },
    },
    defaultVariants: {
      plain: false,
    },
  },
)

type ButtonProps = AriaButtonProps &
  Pick<ComponentProps<"button">, "className" | "formAction"> &
  VariantProps<typeof variants>

export default forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { children, className, formAction, plain, variant, ...props },
  forwardedRef,
) {
  variant = plain ? undefined : variant || "primary"

  const ref = useRef<HTMLButtonElement>(null)
  const { buttonProps, isPressed } = useButton(props, ref)
  const { focusProps, isFocusVisible } = useFocusRing(props)
  const { hoverProps, isHovered } = useHover(props)

  return (
    <button
      className={twMerge(clsx(variants({ plain, variant }), className))}
      data-pressed={isPressed || undefined}
      data-focus-visible={isFocusVisible || undefined}
      data-hovered={isHovered || undefined}
      formAction={formAction}
      ref={mergeRefs(ref, forwardedRef)}
      {...mergeProps(buttonProps, focusProps, hoverProps)}
    >
      {children}
    </button>
  )
})
