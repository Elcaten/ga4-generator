import { RowModel } from "../types/RowModel";
import { TsvRow } from "../types/TsvRow";

export function tokenizeTsvFile({ tsv }: { tsv: string }): RowModel[] {
  return tsv
    .split("\n")
    .map((row) => row.split("\t"))
    .map(rowToModel);
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
