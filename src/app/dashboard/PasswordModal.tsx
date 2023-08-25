"use client"

import { signOut } from "next-auth/react"
import { useState } from "react"
import { Button, Input, Modal, Form } from "~/components"
import { changePassword } from "~/lib/actions"

export default function PasswordModal() {
  const [error, setError] = useState("")

  async function action(formData: Record<string, unknown>) {
    const result = await changePassword(formData)

    if (!result.success) {
      return setError(result.error!)
    }

    setError("")

    signOut({ callbackUrl: "/login" })
  }

  return (
    <Modal
      title="Change Password"
      trigger={
        <Button className="text-zinc-400 data-[hovered]:text-white" plain>
          Change Password
        </Button>
      }
    >
      {error && (
        <div className="mb-4 rounded bg-red-600 p-2 shadow-md shadow-red-900">
          {error}
        </div>
      )}
      <Form action={action}>
        <Input label="Old Password" name="old" type="password" />
        <Input label="New Password" name="new" type="password" />
        <Input label="Confirm New Password" name="confirm" type="password" />
        <Button type="submit">Change Password</Button>
      </Form>
    </Modal>
  )
}
