"use server"

import { compare, hash } from "bcrypt"
import { eq } from "drizzle-orm"
import { safeParse } from "valibot"
import { createSchema } from "./utils"
import db from "~/db"
import { admin as adminSchema } from "~/db/schema"

export async function changePassword(formData: Record<string, unknown>) {
  const admin = await db.query.admin.findFirst()

  if (!admin) {
    return {
      success: false,
      error: "No admin found.",
    }
  }

  const isOldPasswordValid = await compare(
    formData.old as string,
    admin.password,
  )

  if (!isOldPasswordValid) {
    return {
      success: false,
      error: "Invalid old password.",
    }
  }

  if (formData.new !== formData.confirm) {
    return {
      success: false,
      error: "Passwords don't match.",
    }
  }

  if (formData.old === formData.new) {
    return {
      success: false,
      error: "Password is the same.",
    }
  }

  const password = await hash(formData.new as string, 10)

  await db
    .update(adminSchema)
    .set({ password })
    .where(eq(adminSchema.id, admin.id))

  return { success: true }
}

export async function validate(
  schemaTemplate: Record<string, string>,
  data: Record<string, unknown>,
) {
  const schema = createSchema(schemaTemplate)

  const result = safeParse(schema, data)

  if (result.success) return { success: true }

  return {
    success: false,
    issues: result.error.issues.reduce(
      (acc, { message, path }) => ({
        ...acc,
        [path![0].key]: message,
      }),
      {},
    ),
  }
}
