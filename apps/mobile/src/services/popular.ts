import { api } from './api'

export const populars = async () => {
  const res = await api.get(`/api/popular`)
  return res.data
}
