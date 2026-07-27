import { api } from './api'

export interface FavoritesResponse {
  data: any[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export const getFavorites = async (page = 1) => {
  const res = await api.get('/api/profile/favorites', {
    params: { page },
  })
  return res.data.data
}

export interface CheckinsResponse {
  data: any[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export const getCheckins = async (page = 1) => {
  const res = await api.get('/api/profile/checkins', {
    params: { page },
  })
  return res.data.data
}

export const uploadAvatar = async (file: { uri: string; type: string; name: string }) => {
  const formData = new FormData()
  formData.append('avatar', {
    uri: file.uri,
    type: file.type,
    name: file.name,
  } as any)

  const res = await api.post('/api/profile/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return res.data
}

export const updateProfile = async (name: string, email: string, privacy: boolean) => {
  const res = await api.post('/api/profile/update', { name, email, privacy })
  return res.data
}

export const changePassword = async (newPassword: string) => {
  const res = await api.post('/api/profile/change-password', { newPassword })
  return res.data
}
