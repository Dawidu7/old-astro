import type { Metadata } from "next"
import Link from "next/link"
import "~/globals.css"

export const metadata: Metadata = {
  title: "Astrophotography by Patryk Tomalik",
}

export default function RootLayout({
  children,
  modal,
}: Children & { modal: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-zinc-800 text-white">
        <Link href="/">Home</Link>
        <Link href="/dashboard/camera">Camera</Link>
        <main className="flex justify-center">{children}</main>
        {modal}
      </body>
    </html>
  )
}
