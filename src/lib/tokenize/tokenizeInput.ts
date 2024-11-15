import { camelCase } from "lodash"
import { tokenizeItemLabel } from "./tokenizeItemLabel"
import { tokenizeItemLocation } from "./tokenizeItemLocation"
import { tokenizeItemState } from "./tokenizeItemState"
import { RowModel } from "../types/RowModel"

export function tokenizeInput(tableRows: RowModel[]) {
  const eventNames = new Set<string>()

  const tokens = tableRows
    .filter((row) => row["Event description"] != "")
    .map((row) => {
      const actionOrDescription = camelCase(row.eventAction) || camelCase(row["Event description"])
      let eventId = camelCase(actionOrDescription.replace(clearEventId, ""))
      if (eventNames.has(eventId)) {
        console.warn(`Duplicate event name: ${eventId}. Please check manually`)
        eventId = `${eventId}_1`
      }
      eventNames.add(eventId)

      return {
        eventId,
        eventName: row["Event Name"],
        itemLabel: tokenizeItemLabel(row.item_label),
        itemLocation: tokenizeItemLocation(row.item_location),
        tableStatus: row.Status,
        state: tokenizeItemState(row.state),
        status: row.status,
        type: row.type,
      }
    })

  return tokens.filter(({ tableStatus }) => tableStatus !== "disabled")
}

const clearEventId = /listingsManager/
