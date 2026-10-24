"use client"

import React from "react"
import Editor, { BeforeMount, OnMount } from "@monaco-editor/react"
import { useExplorer } from "@/store/useExplorer"
import { Code2 } from "lucide-react"
import { COLLABCODE_DARK_THEME, getMonacoLanguage } from "@/constants/monaco"
import { useParams } from "next/navigation"
import { useUpdateFileContentMutation } from "@/queries/fileExplorer.query"
import type * as monaco from "monaco-editor"

export const MonacoEditorCanvas: React.FC = () => {
  const params = useParams()
  const workspaceId = (params?.workspaceId as string) || ""
  const { currentActiveFile, updateActiveFileContent, clearFocusLine } =
    useExplorer()
  const { updateFileContent } = useUpdateFileContentMutation(workspaceId)

  const editorRef = React.useRef<monaco.editor.IStandaloneCodeEditor>(null)

  // Debounced auto-save reference
  const saveTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  const handleEditorChange = (value: string | undefined) => {
    if (!currentActiveFile) return

    const newContent = value ?? ""
    // 1. Immediately update local Zustand store for instantaneous tab rendering
    updateActiveFileContent(currentActiveFile.path, newContent)

    // 2. Debounce persisting to backend by 800ms
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    const targetPath = currentActiveFile.path
    saveTimeoutRef.current = setTimeout(() => {
      if (workspaceId && targetPath) {
        updateFileContent.mutate({
          path: targetPath,
          content: newContent,
        })
      }
    }, 800)
  }

  // Clear timeout on unmount
  React.useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [])

  const handleBeforeMount: BeforeMount = (monaco) => {
    monaco.editor.defineTheme("collabcode-dark", COLLABCODE_DARK_THEME)
  }

  const handleEditorMount: OnMount = (editor) => {
    editorRef.current = editor

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

  React.useEffect(() => {
    if (
      editorRef.current &&
      currentActiveFile?.focusLine &&
      !currentActiveFile.isLoading // Focus only possible when content is loaded
    ) {
      const line = Number(currentActiveFile.focusLine)
      if (!isNaN(line) && line > 0) {
        requestAnimationFrame(() => {
          editorRef.current?.setPosition({
            lineNumber: line,
            column: 1,
          })
          editorRef.current?.revealLineInCenter(line)
          editorRef.current?.focus()
        })

        clearFocusLine(currentActiveFile.path)
      }
    }
  }, [
    currentActiveFile?.path,
    currentActiveFile?.focusLine,
    currentActiveFile?.isLoading,
    currentActiveFile?.content,
  ])

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
      {/* Polished Code Skeleton Loading State */}
      {currentActiveFile.isLoading && (
        <div className="absolute inset-0 z-10 flex flex-col justify-start gap-2.5 bg-background/95 p-6 backdrop-blur-xs select-none">
          <div className="flex items-center gap-2">
            <div className="h-3.5 w-24 animate-pulse rounded bg-muted-foreground/20" />
            <div className="h-3.5 w-16 animate-pulse rounded bg-muted-foreground/15" />
          </div>
          <div className="h-3.5 w-48 animate-pulse rounded bg-muted-foreground/15" />
          <div className="h-3.5 w-32 animate-pulse rounded bg-muted-foreground/10" />
          <div className="h-3.5 w-64 animate-pulse rounded bg-muted-foreground/20" />
          <div className="my-1 h-3.5 w-0" />
          <div className="flex items-center gap-2 pl-4">
            <div className="h-3.5 w-36 animate-pulse rounded bg-muted-foreground/15" />
            <div className="h-3.5 w-20 animate-pulse rounded bg-muted-foreground/10" />
          </div>
          <div className="h-3.5 w-52 animate-pulse rounded bg-muted-foreground/15 pl-4" />
          <div className="h-3.5 w-40 animate-pulse rounded bg-muted-foreground/10 pl-4" />
        </div>
      )}

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
