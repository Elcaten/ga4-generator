import { parse } from "papaparse";
import { RowModel } from "../types/RowModel";
import { TsvRow } from "../types/TsvRow";

export function tokenizeTsvFile({ tsv }: { tsv: string }): RowModel[] {
  const parseResult = parse<TsvRow>(tsv, { delimiter: "\t" });
  if (parseResult.errors.length > 0) {
    throw new Error("Parse error", {
      cause: { parseErrors: parseResult.errors },
    });
  }
  return parseResult.data.map(rowToModel);
}

function rowToModel(row: TsvRow): RowModel {
  return {
    Status: row[1],
    "Event description": row[3],
    "Event Name": row[4],
    eventAction: row[16],
    item_label: row[22],
    item_location: row[23],
    state: row[24],
    status: row[25],
    type: row[26],
  };
}
