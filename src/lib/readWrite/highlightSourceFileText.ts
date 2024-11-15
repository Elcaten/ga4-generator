import { codeToHtml } from "shiki";

export function highlightSourceFileText({ sourceFileText }: { sourceFileText: string }) {
  return codeToHtml(sourceFileText, {
    lang: "typescript",
    themes: {
      light: "github-light",
      dark: "github-dark-high-contrast",
    },
  });
}
