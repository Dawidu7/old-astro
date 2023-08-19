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
  plugins: [],
}
export default config
