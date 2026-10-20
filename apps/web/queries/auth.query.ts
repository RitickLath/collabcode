import { AuthService } from "@/services/auth.service"
import { LoginProps, RegisterProps } from "@workspace/types/auth"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export const useRegisterMutation = () =>
  useMutation({
    mutationFn: (payload: RegisterProps) => AuthService.register(payload),
    mutationKey: ["register"],
    onSuccess: () => {
      toast.success("Account created successfully!")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

export const useLoginMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: LoginProps) => AuthService.login(payload),
    mutationKey: ["login"],
    onSuccess: (data: any) => {
      toast.success("Logged in successfully!")
      const user = data?.user || data?.data?.user || data?.data || data
      if (user) {
        queryClient.setQueryData(["me"], user)
      }
      queryClient.invalidateQueries({ queryKey: ["me"] })
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export const useMeQuery = () => {
  return useQuery({
    queryKey: ["me"],
    queryFn: () => AuthService.getMe(),
    staleTime: 5 * 60 * 1000,
    retry: false,
  })
}

export const useLogoutMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => AuthService.logout(),
    mutationKey: ["logout"],
    onSuccess: () => {
      queryClient.setQueryData(["me"], null)
    },
  })
}
