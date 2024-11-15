import ts from "typescript";

export function stringifyNodes<T extends ts.Node>(nodes: T[]) {
  return ts
    .createPrinter({ newLine: ts.NewLineKind.LineFeed })
    .printList(
      ts.ListFormat.MultiLine,
      ts.factory.createNodeArray(nodes),
      ts.createSourceFile(
        "temp.ts",
        "",
        ts.ScriptTarget.Latest,
        false,
        ts.ScriptKind.TSX
      )
    );
}
