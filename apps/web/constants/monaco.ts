import type { editor } from "monaco-editor"

export const MONACO_LANGUAGE_MAP: Record<string, string> = {
  ".ts": "typescript",
  ".tsx": "typescript",
  ".js": "javascript",
  ".jsx": "javascript",
  ".mjs": "javascript",
  ".cjs": "javascript",
  ".json": "json",
  ".html": "html",
  ".htm": "html",
  ".css": "css",
  ".scss": "scss",
  ".sass": "scss",
  ".less": "less",
  ".md": "markdown",
  ".mdx": "markdown",
  ".py": "python",
  ".sql": "sql",
  ".yaml": "yaml",
  ".yml": "yaml",
  ".sh": "shell",
  ".bash": "shell",
  ".env": "ini",
  ".dockerfile": "dockerfile",
  ".svg": "xml",
  ".xml": "xml",
  ".graphql": "graphql",
  ".gql": "graphql",
}

export const getMonacoLanguage = (
  extension?: string,
  fileName?: string
): string => {
  const ext = (extension || (fileName ? `.${fileName.split(".").pop()}` : ""))
    .toLowerCase()
    .trim()

  return MONACO_LANGUAGE_MAP[ext] || "plaintext"
}

export const COLLABCODE_DARK_THEME: editor.IStandaloneThemeData = {
  base: "vs-dark",
  inherit: true,
  rules: [
    { token: "comment", foreground: "6e7681", fontStyle: "italic" },
    { token: "keyword", foreground: "ff7b72" },
    { token: "string", foreground: "a5d6ff" },
    { token: "number", foreground: "79c0ff" },
    { token: "regexp", foreground: "7ee787" },
    { token: "type", foreground: "ffa657" },
    { token: "class", foreground: "ffa657" },
    { token: "function", foreground: "d2a8ff" },
    { token: "variable", foreground: "c9d1d9" },
    { token: "variable.predefined", foreground: "79c0ff" },
    { token: "constant", foreground: "79c0ff" },
    { token: "delimiter", foreground: "8b949e" },
    { token: "tag", foreground: "7ee787" },
  ],
  colors: {
    "editor.background": "#090d13",
    "editor.foreground": "#e6edf3",
    "editorLineNumber.foreground": "#484f58",
    "editorLineNumber.activeForeground": "#58a6ff",
    "editor.lineHighlightBackground": "#161b2255",
    "editor.selectionBackground": "#264f78",
    "editor.inactiveSelectionBackground": "#264f7855",
    "editorCursor.foreground": "#58a6ff",
    "editorWhitespace.foreground": "#21262d",
    "editorIndentGuide.background": "#21262d",
    "editorIndentGuide.activeBackground": "#388bfd55",
    "editorBracketMatch.background": "#172b4d",
    "editorBracketMatch.border": "#58a6ff88",
    "editorGutter.background": "#090d13",
  },
}
