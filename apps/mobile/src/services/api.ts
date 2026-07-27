import axios from 'axios'
import { useAuthStore } from '../store'
import { useLocationStore } from '../store'

// export const API_URL = 'http://172.20.10.3:4000'
export const API_URL = 'https://api.vyvecity.com'

/**
 * AXIOS INSTANCE
 */
export const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
})

/**
 * =========================
 * REQUEST INTERCEPTOR
 * =========================
 */
api.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState()
    const { location } = useLocationStore.getState()

    console.log('API REQUEST:', config.method, config.url, accessToken)

    config.headers = config.headers ?? {}

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }

    if (location?.latitude && location?.longitude) {
      config.params = {
        ...config.params,
        lat: location.latitude,
        lng: location.longitude,
      }
    }

    return config
  },
  (error) => Promise.reject(error),
)

/**
 * =========================
 * REFRESH TOKEN HELPER
 * =========================
 */
const refreshAccessToken = async () => {
  const { refreshToken } = useAuthStore.getState()

  if (!refreshToken) {
    throw new Error('No refresh token')
  }

  // ⚠️ api instance KULLANMIYORUZ (loop önlemek için)
  const response = await axios.post(`${API_URL}/api/auth/refresh-token`, { refreshToken })

  return response.data // { accessToken, refreshToken }
}

/**
 * =========================
 * RESPONSE INTERCEPTOR
 * =========================
 */
let isRefreshing = false
let failedQueue: any[] = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      // 🔁 Zaten refresh atılıyorsa kuyruğa al
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`
              resolve(api(originalRequest))
            },
            reject,
          })
        })
      }

      isRefreshing = true

      try {
        const { accessToken, refreshToken } = await refreshAccessToken()

        const authStore = useAuthStore.getState()

        // ❗ User yoksa auth state bozulmuştur
        if (!authStore.user) {
          authStore.logout()
          throw new Error('User missing during token refresh')
        }

        // 🔐 Zustand güncelle
        authStore.setAuth({
          user: authStore.user,
          accessToken,
          refreshToken,
        })

        api.defaults.headers.Authorization = `Bearer ${accessToken}`
        processQueue(null, accessToken)

        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        return api(originalRequest)
      } catch (err) {
        processQueue(err, null)
        useAuthStore.getState().logout()
        return Promise.reject(err)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  },
)
