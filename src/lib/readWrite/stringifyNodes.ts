import { ts } from "ts-morph";
import { createPrinter, factory } from "typescript";

export function stringifyNodes<T extends ts.Node>(
  nodes: T[]
) {
  return createPrinter({ newLine: ts.NewLineKind.LineFeed }).printList(
    ts.ListFormat.MultiLine,
    factory.createNodeArray(nodes),
    ts.createSourceFile(
      "temp.ts",
      "",
      ts.ScriptTarget.Latest,
      false,
      ts.ScriptKind.TSX
    )
  );
}
