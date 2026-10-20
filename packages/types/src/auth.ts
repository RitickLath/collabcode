export interface RegisterProps {
  username: string
  email: string
  password: string
}

export interface LoginProps {
  identifier: string // email or username
  password: string
}

export interface AuthUser {
  id: string
  username: string
  email: string
  isVerified?: boolean
  createdAt?: string | Date
  updatedAt?: string | Date
}
