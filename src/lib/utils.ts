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

  return string([minLength(2, "Must be >= 2 characters long.")])
}
