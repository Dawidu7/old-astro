"use client"

import { signIn } from "next-auth/react"
import { Box, Button, Form, Input } from "~/components"

async function action(formData: Record<string, unknown>) {
  signIn("credentials", {
    password: formData.password,
    callbackUrl: "/dashboard",
  })
}

export default function Login({ searchParams }: SearchParams) {
  const errors = searchParams.error
    ? { password: "Invalid Password" }
    : undefined

  return (
    <Box className="w-64">
      <h2 className="text-center text-3xl font-semibold">Login</h2>
      <Form action={action} errors={errors}>
        <Input label="Password" name="password" type="password" />
        <Button type="submit">Login</Button>
      </Form>
    </Box>
  )
}
