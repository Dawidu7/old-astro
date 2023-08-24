"use client"

import clsx from "clsx"
import { Button } from ".."
import { useNavbar } from "~/lib/hooks"

export default function Footer() {
  const { isVisible } = useNavbar()

  return (
    <footer
      className={clsx(
        "fixed bottom-0 w-full bg-zinc-900 py-4 text-center text-2xl font-semibold shadow-[0_-4px_6px_-1px,0_-2px_4px_-2px] shadow-black transition duration-300",
        isVisible && "translate-y-full",
      )}
    >
      <Button
        className="text-zinc-400 data-[hovered]:text-white"
        onPress={() => scrollTo({ top: 0, behavior: "smooth" })}
        plain
      >
        Astrophotography by Patryk Tomalik
      </Button>
    </footer>
  )
}
