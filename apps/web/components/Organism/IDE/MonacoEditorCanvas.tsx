"use client"

import React from "react"
import Editor, { BeforeMount, OnMount } from "@monaco-editor/react"
import { useExplorer } from "@/store/useExplorer"
import { Code2 } from "lucide-react"
import { COLLABCODE_DARK_THEME, getMonacoLanguage } from "@/constants/monaco"

export const MonacoEditorCanvas: React.FC = () => {
  const { currentActiveFile, updateActiveFileContent } = useExplorer()

  const handleEditorChange = (value: string | undefined) => {
    if (currentActiveFile) {
      updateActiveFileContent(currentActiveFile.path, value ?? "")
    }
  }

  const handleBeforeMount: BeforeMount = (monaco) => {
    monaco.editor.defineTheme("collabcode-dark", COLLABCODE_DARK_THEME)
  }

  const handleEditorMount: OnMount = (editor) => {
    editor.updateOptions({
      fontFamily:
        "var(--font-mono), 'JetBrains Mono', 'Fira Code', Menlo, Monaco, Consolas, monospace",
      fontLigatures: true,
      fontSize: 14.5,
      lineHeight: 24,
      letterSpacing: 0.3,
      fontWeight: "400",
      minimap: { enabled: true, maxColumn: 80, scale: 0.75 },
      scrollBeyondLastLine: false,
      smoothScrolling: true,
      cursorBlinking: "smooth",
      cursorSmoothCaretAnimation: "on",
      formatOnPaste: true,
      formatOnType: true,
      automaticLayout: true,
      padding: { top: 12, bottom: 12 },
      guides: {
        indentation: true,
        bracketPairs: true,
      },
      bracketPairColorization: {
        enabled: true,
      },
      renderWhitespace: "selection",
    })
  }

  if (!currentActiveFile) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center text-center text-muted-foreground select-none">
        <Code2 className="mb-3 h-10 w-10 stroke-[1.2] text-muted-foreground/30" />
        <p className="text-sm font-medium text-foreground/80">No file open</p>
        <p className="mt-1 text-xs text-muted-foreground/60">
          Select a file from the explorer sidebar on the left to start editing
        </p>
      </div>
    )
  }

  const language = getMonacoLanguage(
    currentActiveFile.extension,
    currentActiveFile.name
  )

  return (
    <div className="relative h-full w-full overflow-hidden">
      <Editor
        key={currentActiveFile.path}
        path={currentActiveFile.path}
        theme="collabcode-dark"
        language={language}
        value={currentActiveFile.content || ""}
        onChange={handleEditorChange}
        beforeMount={handleBeforeMount}
        onMount={handleEditorMount}
        options={{
          tabSize: 2,
          insertSpaces: true,
          detectIndentation: true,
          wordWrap: "on",
        }}
        loading={
          <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
            Loading editor...
          </div>
        }
      />
    </div>
  )
}
