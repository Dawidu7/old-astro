import Tabs from "./Tabs"
import { Box, Separator } from "~/components"

export default function Layout({ children }: Children) {
  return (
    <Box className="flex gap-4 sm:max-w-7xl">
      <Tabs />
      <Separator orientation="vertical" />
      {children}
    </Box>
  )
}
