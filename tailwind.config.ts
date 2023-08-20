import type { Config } from "tailwindcss"

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      transitionDuration: {
        250: "250ms",
      },
    },
  },
  plugins: [
    require("@headlessui/tailwindcss"),
    require("@shrutibalasa/tailwind-grid-auto-fit"),
  ],
}
export default config
