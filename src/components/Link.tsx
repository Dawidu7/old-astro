"use client"

import clsx from "clsx"
import { default as NextLink } from "next/link"
import { useRef } from "react"
import type { ComponentProps } from "react"
import { mergeProps, useFocusRing, useHover, useLink } from "react-aria"
import type { AriaLinkOptions } from "react-aria"
import { twMerge } from "tailwind-merge"

type LinkProps = AriaLinkOptions & ComponentProps<typeof NextLink>

export default function Link({
  children,
  className,
  href,
  ...props
}: LinkProps) {
  const ref = useRef<HTMLAnchorElement>(null)
  const { linkProps, isPressed } = useLink(props, ref)
  const { focusProps, isFocusVisible } = useFocusRing(props)
  const { hoverProps, isHovered } = useHover(props)

  return (
    <NextLink
      className={twMerge(
        clsx(
          "text-zinc-400 outline-none transition duration-200 data-[hovered]:text-white",
          className,
        ),
      )}
      data-focus-visible={isFocusVisible || undefined}
      data-hovered={isHovered || undefined}
      data-pressed={isPressed || undefined}
      href={href}
      {...mergeProps(linkProps, focusProps, hoverProps)}
    >
      {children}
    </NextLink>
  )
}
