import { api } from './api'

type SearchType = {
  text: string
  mods: number[]
  tags: string[]
}

type GetOrgsParams = {
  page?: number
  limit?: number
  search?: SearchType | null
}

export const getOrgs = async ({ page = 1, limit = 20, search = null }: GetOrgsParams = {}) => {
  const response = await api.post('/api/org', {
    // params: {
    page,
    limit,
    search,
    // },
  })

  return response.data
}

export const likeOrg = (orgId: string) => {
  return api.post(`/api/org/${orgId}/like`)
}

export const unlikeOrg = (orgId: string) => {
  return api.delete(`/api/org/${orgId}/like`)
}

export const checkIn = (orgId: string, latitude: number, longitude: number) => {
  return api.post(`/api/org/${orgId}/checkin`, { lat: latitude, lng: longitude })
}
