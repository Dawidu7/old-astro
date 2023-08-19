"use server"

import { eq, or } from "drizzle-orm"
import {
  MySqlFloat,
  MySqlInt,
  MySqlSerial,
  MySqlVarChar,
} from "drizzle-orm/mysql-core"
import type { AnyMySqlTable } from "drizzle-orm/mysql-core"
import {
  minLength,
  minValue,
  number,
  object,
  optional,
  safeParse,
  string,
} from "valibot"
import { schemas } from "./utils"
import db from "~/db"

export async function create({
  tableName,
  ...data
}: Record<string, unknown>): Promise<
  | {
      success: false
      type: "table" | "input" | "unique"
      issues: Record<string, string>
    }
  | {
      success: true
    }
> {
  const result = await validate(data, tableName as string)

  if (!result.success) {
    return {
      success: false,
      type: result.type,
      issues: result.issues || {},
    }
  }

  await db.insert(result.table).values(data)

  return {
    success: true,
  }
}

async function validate(
  data: Record<string, unknown>,
  tableName: string,
): Promise<
  | {
      success: false
      type: "table" | "input" | "unique"
      issues?: Record<string, string>
    }
  | {
      success: true
      table: AnyMySqlTable
    }
> {
  const table = schemas[tableName as keyof typeof schemas]

  if (!table) {
    return {
      success: false,
      type: "table",
    }
  }

  const fields = Object.values(table)

  /* Input validation */
  const schema = object(
    fields.reduce((acc, value) => {
      if (value instanceof MySqlFloat || value instanceof MySqlInt) {
        return {
          ...acc,
          [value.name]: number("Must be a number.", [
            minValue(0, "Must be >= 0."),
          ]),
        }
      }

      if (value instanceof MySqlSerial) {
        return {
          ...acc,
          [value.name]: optional(number()),
        }
      }

      if (value instanceof MySqlVarChar) {
        return {
          ...acc,
          [value.name]: string("Must be a string.", [
            minLength(2, "Must be >= 2 characters long."),
          ]),
        }
      }

      return acc
    }, {}),
  )

  const result = safeParse(schema, data)

  if (!result.success) {
    return {
      success: false,
      type: "input",
      issues: result.error.issues.reduce(
        (acc, { path, message }) => ({
          ...acc,
          [path![0].key]: message,
        }),
        {},
      ),
    }
  }

  /* Uniqueness validation */
  const unique = await db
    .select()
    .from(table)
    .where(
      or(
        ...fields.reduce((acc, { isUnique, name }) => {
          if (!isUnique) return acc

          // @ts-expect-error
          return [...acc, eq(table[name], data[name])]
        }, []),
      ),
    )

  if (unique.length !== 0) {
    return {
      success: false,
      type: "unique",
      issues: fields.reduce((acc, { isUnique, name }) => {
        if (!isUnique) return acc

        return {
          ...acc,
          [name]: "Already exists.",
        }
      }, {}),
    }
  }

  return {
    success: true,
    table,
  }
}
