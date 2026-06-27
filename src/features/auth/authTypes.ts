export interface AuthState {
  token: string | null
  userId: number | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}
