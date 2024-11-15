import { trim } from "lodash"

export function tokenizeItemLocation(value: string): ItemLocationToken[] {
  value = value.toLocaleLowerCase()

  const _itemLocationList = value.split("/").map(trim)
  return _itemLocationList.map(extractDataPathArgumentFromItemLocationString)
}

export function extractDataPathArgumentFromItemLocationString(value: string) {
  const parts = value.split(".").map(trim)

  // there is only report name, or reportName with $start
  if (parts.length === 1) {
    if (parts[0].endsWith("_$start")) {
      return {
        type: "pageWithStart",
        page: parts[0].replace("_$start", ""),
      } as const
    }
    return {
      type: "pageOnly",
      page: parts[0],
    } as const
  }

  // there is a report and modal / block name
  if (parts.length !== 2) {
    throw new Error(`invalid item_path: "${value}". item_path should contain 2 parts separated by .`)
  }
  const page = parts[0]
  const modalOrBlock = parts[1]
  const isModal = modalOrBlock.endsWith("odal")

  if (isModal) {
    return {
      type: "modal",
      page: parts[0],
      modal: modalOrBlock.replace("_modal", ""),
    } as const
  }

  return {
    page,
    type: "block",
    block: modalOrBlock,
  } as const
}

export type ItemLocationToken =
  | {
      type: "pageOnly"
      page: string
      modal?: never
      block?: never
    }
  | {
      type: "pageWithStart"
      page: string
      modal?: never
      block?: never
    }
  | {
      type: "modal"
      page: string
      modal: string
      block?: never
    }
  | {
      type: "block"
      page: string
      modal?: never
      block: string
    }
