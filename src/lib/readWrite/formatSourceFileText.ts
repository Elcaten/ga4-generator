import * as parserTypeScript from "prettier/parser-typescript";
import * as prettierPluginEstree from "prettier/plugins/estree";
import * as prettier from "prettier/standalone";

export function formatSourceFileText({ sourceFileText }: { sourceFileText: string }) {
  return prettier.format(sourceFileText, {
    parser: "typescript",
    plugins: [prettierPluginEstree, parserTypeScript],
  });
}
