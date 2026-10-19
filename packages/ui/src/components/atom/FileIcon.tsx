// Common Chevrons
export const ChevronRight = () => (
  <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
    <path
      fillRule="evenodd"
      d="M6.22 3.22a.75.75 0 011.06 0l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06-1.06L9.94 8 6.22 4.28a.75.75 0 010-1.06z"
    />
  </svg>
)

export const ChevronDown = () => (
  <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
    <path
      fillRule="evenodd"
      d="M3.22 6.22a.75.75 0 011.06 0L8 9.94l3.72-3.72a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L3.22 7.28a.75.75 0 010-1.06z"
    />
  </svg>
)

const FolderIcon = () => (
  <svg
    viewBox="0 0 16 16"
    width="16"
    height="16"
    fill="currentColor"
    className="text-blue-400"
  >
    <path d="M1.75 1A1.75 1.75 0 000 2.75v10.5C0 14.216.784 15 1.75 15h12.5A1.75 1.75 0 0016 13.25v-8.5A1.75 1.75 0 0014.25 3H7.543l-1.426-1.426A1.75 1.75 0 004.88 1H1.75zM1.5 2.75C1.5 2.612 1.612 2.5 1.75 2.5h3.13l1.426 1.426A.25.25 0 006.484 4h7.766c.138 0 .25.112.25.25v8.5a.25.25 0 01-.25.25H1.75a.25.25 0 01-.25-.25V2.75z" />
  </svg>
)

const DefaultFileIcon = () => (
  <svg
    viewBox="0 0 16 16"
    width="16"
    height="16"
    fill="currentColor"
    className="text-gray-400"
  >
    <path
      fillRule="evenodd"
      d="M3.75 1.5a.25.25 0 00-.25.25v11.5c0 .138.112.25.25.25h8.5a.25.25 0 00.25-.25V6H9.75A1.75 1.75 0 018 4.25V1.5H3.75zm5.75.56v2.19c0 .138.112.25.25.25h2.19L9.5 2.06zM2 1.75C2 .784 2.784 0 3.75 0h5.086c.464 0 .909.184 1.237.513l3.414 3.414c.329.328.513.773.513 1.237v8.086A1.75 1.75 0 0112.25 15h-8.5A1.75 1.75 0 012 13.25V1.75z"
    />
  </svg>
)

const ReactIcon = () => (
  <svg
    viewBox="0 0 16 16"
    width="16"
    height="16"
    fill="currentColor"
    className="text-cyan-400"
  >
    <path d="M8 2.5a5.5 1.5 0 100 11 5.5 1.5 0 100-11zM8 3c2.4 0 4.5.45 4.5 1s-2.1 1-4.5 1-4.5-.45-4.5-1 2.1-1 4.5-1zm0 9c-2.4 0-4.5-.45-4.5-1s2.1-1 4.5-1 4.5.45 4.5 1-2.1 1-4.5 1z" />
    <circle cx="8" cy="8" r="1.5" />
    <path
      d="M2.5 8a5.5 1.5 0 0111 0 5.5 1.5 0 01-11 0z"
      transform="rotate(60 8 8)"
    />
    <path
      d="M2.5 8a5.5 1.5 0 0111 0 5.5 1.5 0 01-11 0z"
      transform="rotate(120 8 8)"
    />
  </svg>
)

const JsIcon = () => (
  <svg
    viewBox="0 0 16 16"
    width="16"
    height="16"
    fill="currentColor"
    className="text-yellow-400"
  >
    <rect x="2" y="2" width="12" height="12" rx="1" fill="currentColor" />
    <text
      x="12"
      y="12"
      fontSize="7"
      fontWeight="bold"
      fill="black"
      textAnchor="end"
      fontFamily="sans-serif"
    >
      JS
    </text>
  </svg>
)

const TsIcon = () => (
  <svg
    viewBox="0 0 16 16"
    width="16"
    height="16"
    fill="currentColor"
    className="text-blue-500"
  >
    <rect x="2" y="2" width="12" height="12" rx="1" fill="currentColor" />
    <text
      x="13"
      y="12"
      fontSize="7"
      fontWeight="bold"
      fill="white"
      textAnchor="end"
      fontFamily="sans-serif"
    >
      TS
    </text>
  </svg>
)

const JsonIcon = () => (
  <svg
    viewBox="0 0 16 16"
    width="16"
    height="16"
    fill="currentColor"
    className="text-green-500"
  >
    <path
      d="M4.5 2h-1c-.83 0-1.5.67-1.5 1.5v9c0 .83.67 1.5 1.5 1.5h1"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M11.5 2h1c.83 0 1.5.67 1.5 1.5v9c0 .83-.67 1.5-1.5 1.5h-1"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    />
  </svg>
)

const CssIcon = () => (
  <svg
    viewBox="0 0 16 16"
    width="16"
    height="16"
    fill="currentColor"
    className="text-blue-300"
  >
    <text
      x="8"
      y="12"
      fontSize="12"
      fontWeight="bold"
      fill="currentColor"
      textAnchor="middle"
      fontFamily="sans-serif"
    >
      #
    </text>
  </svg>
)

const NpmIcon = () => (
  <svg
    viewBox="0 0 16 16"
    width="16"
    height="16"
    fill="currentColor"
    className="text-red-500"
  >
    <path d="M2 4v8h12V4H2z" fill="currentColor" />
    <path
      d="M4 6h1v4H4V6zm2 0h1v4H6V6zm2 0h1v4H8V6zm2 0h1v4h-1V6zm1 0h1v2h-1V6z"
      fill="white"
    />
  </svg>
)

const HtmlIcon = () => (
  <svg
    viewBox="0 0 16 16"
    width="16"
    height="16"
    fill="currentColor"
    className="text-orange-500"
  >
    <path
      d="M4 4l-3 4 3 4V4zm8 0l3 4-3 4V4zM6.5 13.5l3-11"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const ImageIcon = () => (
  <svg
    viewBox="0 0 16 16"
    width="16"
    height="16"
    fill="currentColor"
    className="text-purple-400"
  >
    <rect
      x="2"
      y="2"
      width="12"
      height="12"
      rx="1.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <circle cx="5.5" cy="5.5" r="1.5" fill="currentColor" />
    <path
      d="M2 11l4-4 3 3 2-2 3 3"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const MarkdownIcon = () => (
  <svg
    viewBox="0 0 16 16"
    width="16"
    height="16"
    fill="currentColor"
    className="text-blue-400"
  >
    <path
      fillRule="evenodd"
      d="M14.5 3h-13a1.5 1.5 0 00-1.5 1.5v7A1.5 1.5 0 001.5 13h13a1.5 1.5 0 001.5-1.5v-7A1.5 1.5 0 0014.5 3zM4 10H2V6h2l2 2 2-2h2v4H8V7.5L6.5 9h-1L4 7.5V10zm9 0h-2V8h-1.5L12 5.5 14.5 8H13v2z"
    />
  </svg>
)

const GitIcon = () => (
  <svg
    viewBox="0 0 16 16"
    width="16"
    height="16"
    fill="currentColor"
    className="text-orange-600"
  >
    <path
      fillRule="evenodd"
      d="M12.293 2.293a1 1 0 0 1 1.414 0l.001.001 2.152 2.152a1 1 0 0 1 0 1.414l-8.586 8.586a1 1 0 0 1-1.414 0l-.001-.001-2.152-2.152a1 1 0 0 1 0-1.414l8.586-8.586zM8 4.5A1.5 1.5 0 1 1 6.5 6h-1a2.5 2.5 0 1 0 3 2.45v2.1a1.5 1.5 0 1 1-1 .001V8.5H6.5v2.051a2.5 2.5 0 1 0 2-3.102V4.5z"
    />
  </svg>
)

const ConfigIcon = () => (
  <svg
    viewBox="0 0 16 16"
    width="16"
    height="16"
    fill="currentColor"
    className="text-gray-400"
  >
    <path
      fillRule="evenodd"
      d="M8 1a1 1 0 0 1 1 1v1.1a4.002 4.002 0 0 1 2.05 1.185l.95-.95a1 1 0 1 1 1.415 1.415l-.95.95A4.002 4.002 0 0 1 13.65 7H14.5a1 1 0 1 1 0 2h-.85a4.002 4.002 0 0 1-1.185 2.05l.95.95a1 1 0 0 1-1.415 1.415l-.95-.95A4.002 4.002 0 0 1 9 13.65v.85a1 1 0 1 1-2 0v-.85a4.002 4.002 0 0 1-2.05-1.185l-.95.95a1 1 0 1 1-1.415-1.415l.95-.95A4.002 4.002 0 0 1 2.35 9H1.5a1 1 0 1 1 0-2h.85a4.002 4.002 0 0 1 1.185-2.05l-.95-.95a1 1 0 1 1 1.415-1.415l.95.95A4.002 4.002 0 0 1 7 3.1V2a1 1 0 0 1 1-1zm0 4.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z"
    />
  </svg>
)

export const FileIcon = ({
  name,
  isFolder,
}: {
  name?: string
  isFolder?: boolean
}) => {
  if (isFolder) return <FolderIcon />

  const lowerName = (name || "").toLowerCase()

  if (lowerName === "package.json" || lowerName === "package-lock.json")
    return <NpmIcon />
  if (lowerName === ".gitignore" || lowerName === ".gitattributes")
    return <GitIcon />

  if (lowerName.endsWith(".html") || lowerName.endsWith(".htm"))
    return <HtmlIcon />
  if (lowerName.endsWith(".md") || lowerName.endsWith(".mdx"))
    return <MarkdownIcon />
  if (
    lowerName.endsWith(".png") ||
    lowerName.endsWith(".jpg") ||
    lowerName.endsWith(".jpeg") ||
    lowerName.endsWith(".svg") ||
    lowerName.endsWith(".gif") ||
    lowerName.endsWith(".ico") ||
    lowerName.endsWith(".webp")
  )
    return <ImageIcon />
  if (lowerName.endsWith(".jsx") || lowerName.endsWith(".tsx"))
    return <ReactIcon />
  if (
    lowerName.endsWith(".js") ||
    lowerName.endsWith(".cjs") ||
    lowerName.endsWith(".mjs")
  )
    return <JsIcon />
  if (lowerName.endsWith(".ts")) return <TsIcon />
  if (lowerName.endsWith(".json")) return <JsonIcon />
  if (
    lowerName.endsWith(".css") ||
    lowerName.endsWith(".scss") ||
    lowerName.endsWith(".sass")
  )
    return <CssIcon />

  if (
    lowerName.startsWith(".env") ||
    lowerName.includes("config") ||
    lowerName.startsWith(".")
  )
    return <ConfigIcon />

  return <DefaultFileIcon />
}

export {
  NewFileIcon,
  NewFolderIcon,
  RefreshIcon,
  CollapseAllIcon,
} from "./ExplorerIcons"
