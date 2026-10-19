import axios, { AxiosRequestConfig, AxiosResponse, isAxiosError } from "axios"

export class ApiClient {
  private static client = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  })

  static async request<T>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client.request(config)
      return response.data
    } catch (err) {
      if (isAxiosError(err)) {
        throw new Error(err.response?.data?.message || "Something went wrong")
      }
      throw new Error("Something went wrong")
    }
  }

  static async get<T>(
    url: string,
    params?: Record<string, unknown>
  ): Promise<T> {
    return this.request<T>({ method: "GET", url, params })
  }

  static async post<T, D = unknown>(url: string, data?: D): Promise<T> {
    return this.request<T>({ method: "POST", url, data })
  }

  static async put<T, D = unknown>(url: string, data?: D): Promise<T> {
    return this.request<T>({ method: "PUT", url, data })
  }

  static async delete<T>(
    url: string,
    params?: Record<string, unknown>
  ): Promise<T> {
    return this.request<T>({ method: "DELETE", url, params })
  }
}
