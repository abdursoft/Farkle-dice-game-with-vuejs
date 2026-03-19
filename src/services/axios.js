import axios from 'axios'

const host = import.meta.env.VITE_API_HOST;

const apiClient = axios.create({
  baseURL: `${host.replace(/\/+$/, '')}/`,
  withCredentials: true
})

apiClient.interceptors.request.use(async (config) => {
  const { useAuthStore } = await import('@/stores/authStore');
  const authStore = useAuthStore()

  const token = authStore.authToken ?? localStorage.getItem('dicToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  if (config.otpToken) {
    config.headers.otpToken = config.otpToken
  }
  if (config.url) {
    config.url = config.url.replace(/\/+$/, '')
  }
  return config
})

export default apiClient