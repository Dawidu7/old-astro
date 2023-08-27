import { saveAs } from "file-saver"
import { minLength, minValue, number, object, optional, string } from "valibot"

export function mergeRefs<T = any>(
  ...refs: Array<React.MutableRefObject<T> | React.LegacyRef<T>>
): React.RefCallback<T> {
  return value => {
    refs.forEach(ref => {
      if (typeof ref === "function") {
        ref(value)
      } else if (ref != null) {
        ;(ref as React.MutableRefObject<T | null>).current = value
      }
    })
  }
}

export function filterObject(
  obj: Record<string, any>,
  keys: string[],
  negate?: boolean,
) {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) =>
      negate ? !keys.includes(key) : keys.includes(key),
    ),
  )
}

export function saveFile(text: string[], filename: string, extension = "txt") {
  const blob = new Blob(text, { type: "text/plain;charset=utf-8" })

  saveAs(blob, `${filename}.${extension}`)
}

export function round(num: number, decimal = 1) {
  return Math.round(num * 10 ** decimal) / 10 ** decimal
}

export function createSchema(template: Record<string, string>) {
  return object(
    Object.entries(template).reduce((acc, [key, value]) => {
      if (typeof value === "string") return { ...acc, [key]: getValue(value) }

      return {
        ...acc,
        [key]: object(
          Object.entries(value).reduce((obj, [objKey, objValue]) => {
            if (objKey === "id") {
              return {
                ...obj,
                [objKey]: optional(getValue(objValue as string)),
              }
            }

            return {
              ...obj,
              [objKey]: getValue(objValue as string),
            }
          }, {}),
        ),
      }
    }, {}),
  )
}

function getValue(value: string) {
  if (value === "number") {
    return number("Must be a number.", [minValue(0, "Must be >= 0.")])
  }

  return string([minLength(1, "Must be >= 1 characters long.")])
}
