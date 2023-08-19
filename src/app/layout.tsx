import type { Metadata } from "next"
import "~/globals.css"

export const metadata: Metadata = {
  title: "Astrophotography by Patryk Tomalik",
}

export default function RootLayout({ children }: Children) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}
