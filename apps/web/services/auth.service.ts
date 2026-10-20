import { ApiClient } from "@/lib/axiosInstance"
import { LoginProps, RegisterProps } from "@workspace/types/auth"

export const AuthService = {
  register: async (body: RegisterProps) => {
    const response = await ApiClient.post("/auth/register", body)
    return response
  },

  login: async (body: LoginProps) => {
    const response = await ApiClient.post("/auth/login", body)
    return response
  },

  getMe: async () => {
    const response = await ApiClient.get("/auth/me")
    return response
  },

  checkUsername: async (username: string) => {
    const response: any = await ApiClient.get("/auth/check-username", {
      username,
    })
    return {
      isAvailable: Boolean(
        response?.data?.isAvailable ?? response?.isAvailable
      ),
    }
  },

  logout: async () => {
    const response = await ApiClient.post("/auth/logout")
    return response
  },

  verifyEmail: async (token: string, email: string) => {
    const response = await ApiClient.get("/auth/verify-email", {
      token,
      email,
    })
    return response
  },
}
