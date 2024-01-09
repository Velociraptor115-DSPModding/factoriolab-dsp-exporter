import stringify from "fast-json-stable-stringify";
import { format } from "json-string-formatter";
import { keyOrder } from "./object-key-sorter";

const orderOfKeys = [
  // For data.json
  "version",
  "categories",
  "icons",
  "items",
  "recipes",
  "limitations",
  "defaults",

  // common
  "category",
  "id",
  "name",

  // For recipes
  "cost",
  "time",
  "in",
  "out",
  "producers",
  "isMining",
  "isTechnology",
  "unlockedBy",

  // common
  "row",

  // For items
  "stack",
  "machine",
  "belt",
  "fuel",
  "technology",

  // common
  "icon",
  "iconText",
]

export function stableStringify(obj: any) {
  return format(stringify(obj, keyOrder(orderOfKeys)), '  ')
}
