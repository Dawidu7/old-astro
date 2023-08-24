"use client"

import clsx from "clsx"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { useEffect, useRef, useState } from "react"
import { RxCross1, RxHamburgerMenu } from "react-icons/rx"
import ResizeObserver from "resize-observer-polyfill"
import { Button, Link, Modal } from ".."
import { useNavbar } from "~/lib/hooks"

export default function Navbar({
  isAuthenticated,
}: {
  isAuthenticated: boolean
}) {
  const pathname = usePathname()
  const ref = useRef<HTMLElement>(null)
  const [isOpen, setOpen] = useState(false)
  const { setVisible } = useNavbar()

  useEffect(() => {
    const nav = ref.current

    if (!nav) return

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting)
    })

    const resizeObserber = new ResizeObserver(() => {
      if (nav.clientWidth >= 768) {
        setOpen(false)
      }
    })

    intersectionObserver.observe(nav)
    resizeObserber.observe(nav)

    return () => {
      intersectionObserver.disconnect()
      resizeObserber.disconnect()
    }
  }, [])

  useEffect(() => setOpen(false), [pathname])

  const links = [
    { route: "/calculator", text: "Calculator" },
    { route: "/generator", text: "Generator" },
    { route: "/planner", text: "Planner" },
    { route: isAuthenticated ? "/dashboard" : "/login", text: "Admin" },
  ]

  function List() {
    return (
      <>
        {links.map(({ route, text }) => (
          <li key={route}>
            <Link
              className={
                pathname.startsWith(route)
                  ? "font-semibold text-white"
                  : undefined
              }
              href={route}
            >
              {text}
            </Link>
          </li>
        ))}
        {isAuthenticated && (
          <Modal
            title="Confirm Logout"
            trigger={
              <Button className="text-zinc-400 data-[hovered]:text-white" plain>
                Logout
              </Button>
            }
          >
            {({ onClose }) => (
              <>
                Are you sure you want to logout?
                <div className="mt-4 flex gap-4">
                  <Button
                    className="flex-1"
                    onPress={onClose}
                    variant="destructive"
                  >
                    Cancel
                  </Button>
                  <Button className="flex-1" onPress={() => signOut()}>
                    Logout
                  </Button>
                </div>
              </>
            )}
          </Modal>
        )}
      </>
    )
  }

  return (
    <nav
      className="mb-12 flex items-center justify-between bg-zinc-900 p-4 shadow-md shadow-black"
      ref={ref}
    >
      <Link href="/" className="text-2xl font-semibold text-white">
        Astrophotography by Patryk Tomalik
      </Link>
      <Button
        className="text-3xl text-zinc-400 data-[hovered]:text-white md:hidden"
        onPress={() => setOpen(true)}
        plain
      >
        <RxHamburgerMenu />
      </Button>
      <div
        className={clsx(
          "fixed inset-0 z-30 bg-black/80 transition-opacity duration-200",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />
      <ul
        className={clsx(
          "fixed right-0 top-0 z-30 h-full space-y-4 bg-zinc-800 pl-20 pr-8 pt-6 text-right text-3xl transition duration-300 ease-in-out md:hidden",
          !isOpen && "translate-x-full",
        )}
      >
        <li>
          <Button
            className="text-zinc-400 data-[hovered]:text-white md:hidden"
            onPress={() => setOpen(false)}
            plain
          >
            <RxCross1 />
          </Button>
        </li>
        <List />
      </ul>
      <ul className="hidden gap-2 text-base md:flex">
        <List />
      </ul>
    </nav>
  )
}
