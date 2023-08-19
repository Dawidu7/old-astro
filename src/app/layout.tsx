import type { Metadata } from "next"
import "~/globals.css"

export const metadata: Metadata = {
  title: "Astrophotography by Patryk Tomalik",
}

export default function RootLayout({ children }: Children) {
  return (
    <html lang="en">
      <body className="bg-zinc-800 text-white">
        <main className="flex justify-center">{children}</main>
      </body>
    </html>
  )
}
