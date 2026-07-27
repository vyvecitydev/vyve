import { api } from './api'

export const followUser = (userId: string) => {
  return api.post(`/api/user/${userId}/follow`)
}

export const unfollowUser = (userId: string) => {
  return api.delete(`/api/user/${userId}/follow`)
}

export const getNotifications = (userId: string) => {
  return api.get(`/api/user/${userId}/notifications`)
}
