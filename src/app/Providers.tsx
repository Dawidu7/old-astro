"use client"

import { NavbarProvider } from "~/lib/hooks/useNavbar"

export default function Providers({ children }: Children) {
  return <NavbarProvider>{children}</NavbarProvider>
}
