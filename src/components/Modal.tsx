"use client"

import clsx from "clsx"
import { useRouter } from "next/navigation"
import { cloneElement, Fragment, useEffect, useState } from "react"
import { RxCross1 } from "react-icons/rx"
import { Dialog, Transition } from "@headlessui/react"
import { Button, Separator } from "."

type ModalProps = {
  children:
    | React.ReactNode
    | (({ onClose }: { onClose: () => void }) => React.ReactNode)
  trigger?: ReturnType<typeof Button>
} & (
  | {
      full: true
      title: never
    }
  | {
      full?: false
      title: React.ReactNode
    }
)

export default function Modal({ children, full, title, trigger }: ModalProps) {
  const { back } = useRouter()
  const [isOpen, setOpen] = useState(false)

  useEffect(() => {
    if (!trigger) {
      setOpen(true)
    }
  }, [trigger])

  function onClose() {
    if (trigger) setOpen(false)
    else back()
  }

  return (
    <>
      {trigger &&
        cloneElement(trigger as JSX.Element, { onPress: () => setOpen(true) })}
      <Transition appear as={Fragment} show={isOpen}>
        <Dialog className="relative z-50" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="duration-250"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/80" aria-hidden="true" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="grid min-h-full place-items-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-250"
                enterFrom="opacity-0 scale-0"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-0"
              >
                <Dialog.Panel className="w-fit max-w-5xl rounded-lg bg-zinc-800 2xl:max-w-7xl">
                  <Dialog.Title
                    className={clsx(
                      "flex items-center justify-between text-4xl",
                      !full && "p-4",
                    )}
                  >
                    {title}
                    <Button
                      className={full ? "absolute right-1 top-1" : undefined}
                      onPress={onClose}
                      plain
                    >
                      <RxCross1 />
                    </Button>
                  </Dialog.Title>
                  {!full && <Separator />}
                  <main className={clsx(!full && "p-4")}>
                    {typeof children === "function"
                      ? children({ onClose })
                      : children}
                  </main>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
