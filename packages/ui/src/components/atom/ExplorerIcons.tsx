import React from "react"

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number
}

// VS Code "New File" icon (optically centered at Y=8)
export const NewFileIcon: React.FC<IconProps> = ({
  size = 16,
  className = "",
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="currentColor"
    className={`block shrink-0 ${className}`}
    {...props}
  >
    <path d="M13 9h-1v3H9v1h3v3h1v-3h3v-1h-3V9z" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9 1H3a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h5v-1H3V2h5v4h4v2h1V5l-4-4zm0 1.414L11.586 5H9V2.414z"
    />
  </svg>
)

// VS Code "New Folder" icon (shifted up 1px to align with file icon)
export const NewFolderIcon: React.FC<IconProps> = ({
  size = 16,
  className = "",
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 1 16 16"
    fill="currentColor"
    className={`block shrink-0 ${className}`}
    {...props}
  >
    <path d="M13 9h-1v3H9v1h3v3h1v-3h3v-1h-3V9z" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14.5 4H7.71l-.85-.85L6.51 3h-5l-.5.5v9l.5.5h6.5v-1H2V4h4.29l.86.85.35.15H14v3h1V4.5l-.5-.5z"
    />
  </svg>
)

// VS Code "Refresh Explorer" icon (aligned to Y=8 center)
export const RefreshIcon: React.FC<IconProps> = ({
  size = 16,
  className = "",
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0.5 16 16"
    fill="currentColor"
    className={`block shrink-0 ${className}`}
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4.681 3H2V2h3.5l.5.5V6H5V4a5 5 0 1 0 4.53-.761l.302-.954A6 6 0 1 1 4.681 3z"
    />
  </svg>
)

// VS Code "Collapse Folders in Explorer" icon (shifted up 1.5px to align with other icons)
export const CollapseAllIcon: React.FC<IconProps> = ({
  size = 16,
  className = "",
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 1.5 16 16"
    fill="currentColor"
    className={`block shrink-0 ${className}`}
    {...props}
  >
    <path d="M9 9H4v1h5V9z" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3 4l.5-.5h8l.5.5v8l-.5.5h-1V12h1V4H4v1H3V4zm-2 2l.5-.5h9l.5.5v9l-.5.5h-9l-.5-.5V6zm1 9h8V6H2v9z"
    />
  </svg>
)
