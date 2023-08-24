import type { Metadata } from "next"
import Providers from "./Providers"
import { Footer, Navbar } from "~/components/layout"
import { isAuthenticated } from "~/lib/auth"
import "~/globals.css"

export const metadata: Metadata = {
  title: "Astrophotography by Patryk Tomalik",
}

export default async function RootLayout({ children }: Children) {
  return (
    <html>
      <body className="h-[150vh] bg-zinc-800 text-lg text-white">
        <Providers>
          <Navbar isAuthenticated={await isAuthenticated()} />
          <main className="flex justify-center">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
