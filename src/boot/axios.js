import { boot } from 'quasar/wrappers'
import axios from 'axios'

const authTokenKey = 'mdfurniture_auth_token'

const api = axios.create({
  baseURL: import.meta.env.QCLI_API_BASE_URL || 'http://localhost:8000/api/v1',
  headers: {
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(authTokenKey) || sessionStorage.getItem(authTokenKey)

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export default boot(({ app }) => {
  app.config.globalProperties.$api = api
})

export { api }
