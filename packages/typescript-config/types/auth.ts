export interface RegisterProps {
  username: string
  email: string
  password: string
}

export interface LoginProps {
  identifier: string // email or username
  password: string
}
