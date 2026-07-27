import { api } from './api'

interface SignupPayload {
  provider: string
  name: string
  email: string
  password: string
}

export const signup = async (payload: SignupPayload) => {
  const response = await api.post('/api/auth/signup', payload)
  return response.data
}

interface LoginPayload {
  email: string
  password: string
}

export const login = async (payload: LoginPayload) => {
  const response = await api.post('/api/auth/login', payload)
  return response.data
}

interface GoogleLoginPayload {
  provider: string
  idToken: string
}

export const googleLogin = async (payload: GoogleLoginPayload) => {
  const response = await api.post('/api/auth/google', payload)
  return response.data
}

export const logout = async () => {
  const response = await api.post('/api/auth/logout')
  return response.data
}

export const getCurrentUser = async () => {
  const res = await api.get('/api/auth/me')
  return res.data
}