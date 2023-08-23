"use server"

import { safeParse } from "valibot"
import { createSchema } from "./utils"

export async function create() {}

export async function remove() {}

export async function update() {}

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
