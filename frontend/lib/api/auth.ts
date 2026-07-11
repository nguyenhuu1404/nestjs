import { apiClient } from "./client";
import { User } from "@/types/user";

export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post<{ accessToken: string }>("/auth/login", { email, password }),
  me: (token: string) => apiClient.get<User>("/auth/me", { token }),
};
