import { codeToHtml } from "shiki";

export function highlightSourceFileText({ sourceFileText }: { sourceFileText: string }) {
  return codeToHtml(sourceFileText, {
    lang: "typescript",
    theme: "min-light",
  });
}
