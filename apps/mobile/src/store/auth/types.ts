export interface User {
  id: string
  name: string
  email: string
}

export interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
}

export interface AuthActions {
  setAuth: (payload: { user: User; accessToken: string; refreshToken: string }) => void

  logout: () => void
}
